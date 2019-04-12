const dateFormat = require('dateformat');
const Role = require('mongoose').model('Role');
const joiValidation = require('../validation/role');

const create = async (req, res, next) => {
    const validation = await joiValidation.validateCreateUpdateInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });

    const now = new Date();
    const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    const objRole = new Role({
        ...validation.value,
        createdAt: datetime,
        updatedAt: datetime
    });
    objRole.save((error, data) => {
        if (error) {
            if (error.code && error.code === 11000) return res.status(200).json(
                { error: [{ key: 'name', value: 'name is already taken.' }], message: '' }
            );
            return res.status(200).json({ error, message: error.message || 'Internal server error!' });
        }
        return res.status(200).json({ error: null, data });
    });
};

const update = async (req, res, next) => {
    const validation = await joiValidation.validateCreateUpdateInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });

    const now = new Date();
    const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    validation.value.updatedAt = datetime;

    Role.updateOne({ _id: req.headers._id }, { $set: validation.value }, (err, result) => {
        if (err) {
            if (err.code && err.code === 11000) return res.status(200).json(
                { error: [{ key: 'name', value: 'name is already taken.' }], message: '' }
            );
            return res.status(200).json({ error, message: error.message || 'Internal server error!' });
        }
        return res.status(200).json({ error: null, message: 'Record has been saved successfully.' });
    });
};

const remove = async (req, res, next) => {
    const validation = await joiValidation.validateRemoveInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });
    Role.findByIdAndDelete(validation.value, (err, data) => {
        if (err) return res.status(200).json({ error: "Invalid resource", message: '' });
        return res.status(200).json({ error: null, message: 'Record has been deleted successfully.' });
    });
};

const list = async (req, res, next) => {
    const { search } = req.body;
    const limit = parseInt(req.body.limit);
    let page = parseInt(req.body.page);
    if (page > 0) {
        page = page - 1;
    }
    const skip = parseInt(limit * page);
    Role.aggregate([
        {
            $match: {
                name: search.name ? { $regex: `^${search.name}`, $options: 'i' } : { $ne: '' },
                status: search.status
            }
        },
        {
            $skip: parseInt(skip)
        },
        {
            $limit: parseInt(limit)
        },
        {
            $project: {
                _id: "$_id",
                name: "$name",
                status:
                {
                    $cond: [{ $eq: ["$status", 1] }, "Active", "Inactive"]
                },
                createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                updatedAt: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }
            }
        }
    ])
        .exec((error, response) => {
            if (error) return res.status(200).json({ error: error, result: [] });
            return res.status(200).json({ error: null, result: response });
        });
};

const totalRoles = (req, res, next) => {
    const { search } = req.body;
    Role.countDocuments({
        name: search.name ? { $regex: `^${search.name}`, $options: 'i' } : { $ne: '' },
        status: search.status
    }, (error, data) => {
        if (error) return res.status(200).json({ error, total: 0 });
        return res.status(200).json({ error: null, total: data });
    });
};

const findAll = async (req, res, next) => {
    Role.find({}, { name: 1 }, (error, response) => {
        if (error) return res.status(200).json({ error: error, result: [] });
        return res.status(200).json({ error: null, result: response });
    });
};

const findByAttr = async (req, res, next) => {
    const validation = await joiValidation.validateRemoveInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });
    const findRole = await findRoleByAttributes(validation.value);
    if (findRole.error || !findRole.data) return res.status(200).json({ error: 'data not found', message: 'data not found' });
    return res.status(200).json({ error: null, result: findRole.data });
};

const findRoleByAttributes = condition => {
    return new Promise(resolve => {
        Role.findOne(condition, (error, data) => {
            if (error) return resolve(error);
            if (data) return resolve({ error: null, data });
            return resolve({ error: null, data: null });
        });
    });
};

module.exports = { create, update, remove, list, totalRoles, findAll, findByAttr };