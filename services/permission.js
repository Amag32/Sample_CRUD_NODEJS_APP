const dateFormat = require('dateformat');
const Permission = require('mongoose').model('Permission');
const joiValidation = require('../validation/permission');

const create = async (req, res, next) => {
    const validation = await joiValidation.validateCreateUpdateInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });

    const now = new Date();
    const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    const objPermission = new Permission({ ...validation.value, createdAt: datetime, updatedAt: datetime });
    objPermission.save((error, data) => {
        if (error) {
            if (error.code && error.code === 11000) return res.status(200).json({ error: [{ module: 'Module is already taken.' }], message: '' });
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
    Permission.updateOne({ _id: req.headers._id }, { $set: { ...validation.value, updatedAt: datetime } }, (error, data) => {
        if (error) {
            if (error.code && error.code === 11000) return res.status(200).json({ error: [{ module: 'Module is already taken.' }], message: '' });
            return res.status(200).json({ error, message: error.message || 'Internal server error!' });
        }
        return res.status(200).json({ error: null, data });
    });
};
const remove = async (req, res, next) => {
    const validation = await joiValidation.validateRemoveInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });
    Permission.findByIdAndDelete(validation.value, (err, data) => {
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
    Permission.aggregate([
        {
            $match: {
                fkRole: search.fkRole ? { $regex: `^${search.fkRole}`, $options: 'i' } : { $ne: '' },
                module: search.module ? { $regex: `^${search.module}`, $options: 'i' } : { $ne: '' }
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
                fkRole: "$fkRole",
                module: "$module",
                list:
                {
                    $cond: [{ $eq: ["$list", true] }, "Yes", "No"]
                },
                view:
                {
                    $cond: [{ $eq: ["$view", true] }, "Yes", "No"]
                },
                create:
                {
                    $cond: [{ $eq: ["$create", true] }, "Yes", "No"]
                },
                update:
                {
                    $cond: [{ $eq: ["$update", true] }, "Yes", "No"]
                },
                removed:
                {
                    $cond: [{ $eq: ["$removed", true] }, "Yes", "No"]
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

const totalItems = (req, res, next) => {
    const { search } = req.body;
    Permission.countDocuments({
        fkRole: search.fkRole ? { $regex: `^${search.fkRole}`, $options: 'i' } : { $ne: '' },
        module: search.module ? { $regex: `^${search.module}`, $options: 'i' } : { $ne: '' }
    }, (error, data) => {
        if (error) return res.status(200).json({ error, total: 0 });
        return res.status(200).json({ error: null, total: data });
    });
};

const findByAttr = async (req, res, next) => {
    const validation = await joiValidation.validateRemoveInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });
    const findPermission = await findPermissionByAttributes(validation.value);
    if (findPermission.error || !findPermission.data) return res.status(200).json({ error: 'data not found', message: 'data not found' });
    return res.status(200).json({ error: null, result: findPermission.data });
};

const findPermissionByAttributes = condition => {
    return new Promise(resolve => {
        Permission.findOne(condition, (error, data) => {
            if (error) return resolve(error);
            if (data) return resolve({ error: null, data });
            return resolve({ error: null, data: null });
        });
    });
};
module.exports = { create, update, remove, list, totalItems, findByAttr };