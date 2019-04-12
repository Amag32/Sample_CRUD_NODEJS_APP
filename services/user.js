const dateFormat = require('dateformat');
const randomstring = require("randomstring");
const User = require('mongoose').model('User');
const joiValidation = require('../validation/user');
const encryption = require('../lib/encryption');

const create = async (req, res, next) => {
    req.body.fkRole = req.body.fkRole || 'guest';
    const validation = await joiValidation.validateCreateInput({ ...req.body, code: randomstring.generate(32) });
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });

    const now = new Date();
    const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    const objUser = new User({
        fkRole: validation.value ? validation.value : 'guest',
        ...validation.value,
        password: encryption.encrypt(validation.value.password, validation.value.code),
        createdAt: datetime,
        updatedAt: datetime
    });

    objUser.save((error, data) => {
        if (error) {
            if (error.code && error.code === 11000) return res.status(200).json(
                { error: [{ key: 'email', value: 'Email Address is already taken.' }], message: '' }
            );
            return res.status(200).json({ error, message: error.message || 'Internal server error!' });
        }
        return res.status(200).json({ error: null, data });
    });
};

const update = async (req, res, next) => {
    const validation = await joiValidation.validateUpdateInput({ ...req.body, code: randomstring.generate(32) });
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });

    const { fname, lname, email, password, fkRole, verify, status, code } = validation.value;
    const now = new Date();
    const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    const buildInput = { fname, lname, email, fkRole, verify, status, updatedAt: datetime };
    if (password || password !== '') {
        buildInput.password = encryption.encrypt(password, code);
        buildInput.code = code;
    }
    User.updateOne({ _id: req.headers._id }, { $set: buildInput }, (err, result) => {
        if (err) {
            if (err.code && err.code === 11000) return res.status(200).json(
                { error: [{ key: 'email', value: 'Email Address is already taken.' }], message: '' }
            );
            return res.status(200).json({ error, message: error.message || 'Internal server error!' });
        }
        return res.status(200).json({ error: null, message: 'Record has been saved successfully.' });
    });
};

const remove = async (req, res, next) => {
    const validation = await joiValidation.validateRemoveInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });
    User.findByIdAndDelete(validation.value, (err, data) => {
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
    const nameSplit = search.name ? search.name.split(' ') : '';
    User.aggregate([
        {
            $match: {
                fname: nameSplit && nameSplit.length ? { $regex: `^${nameSplit[0]}`, $options: 'i' } : { $ne: '' },
                lname: nameSplit && nameSplit.length > 1 ? { $regex: `^${nameSplit[1]}`, $options: 'i' } : { $ne: '' },
                email: search.email ? { $regex: `^${search.email}`, $options: 'i' } : { $ne: '' },
                verify: eval(search.verify),
                fkRole: search.fkRole ? search.fkRole : { $ne: '' },
                status: parseInt(search.status, 10)
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
                name: { $concat: ['$fname', ' ', '$lname'] },
                email: "$email",
                fkRole: "$fkRole",
                verify:
                {
                    $cond: [{ $eq: ["$verify", true] }, "Yes", "No"]
                },
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
const totalUsers = (req, res, next) => {
    const { search } = req.body;
    const nameSplit = search.name ? search.name.split(' ') : '';
    User.countDocuments({
        fname: nameSplit && nameSplit.length ? { $regex: `^${nameSplit[0]}`, $options: 'i' } : { $ne: '' },
        lname: nameSplit && nameSplit.length > 1 ? { $regex: `^${nameSplit[1]}`, $options: 'i' } : { $ne: '' },
        email: search.email ? { $regex: `^${search.email}`, $options: 'i' } : { $ne: '' },
        verify: eval(search.verify),
        fkRole: search.fkRole ? search.fkRole : { $ne: '' },
        status: parseInt(search.status, 10)
    }, (error, data) => {
        if (error) return res.status(200).json({ error, total: 0 });
        return res.status(200).json({ error: null, total: data });
    });
};


const login = async (req, res, next) => {
    const validation = await joiValidation.validateLoginInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });

    const findUserByEmail = await findUserByAttributes({ email: validation.value.email });

    if (findUserByEmail.error || !findUserByEmail.data) return res.status(200).json(
        {
            error: [{ key: 'email', value: 'Incorrect email address' }, { key: 'password', value: 'Incorrect password' }],
            message: 'Incorrect Email/Password, Please try again!'
        });

    if (encryption.decrypt(findUserByEmail.data.password, findUserByEmail.data.code) !== validation.value.password) return res.status(200).json(
        {
            error: [{ key: 'email', value: '' }, { key: 'password', value: 'Incorrect password' }],
            message: ''
        });
    return res.status(200).json({ error: null, message: 'Logging successfull.' });
};

const findByAttr = async (req, res, next) => {
    const validation = await joiValidation.validateRemoveInput(req.body);
    if (validation.error) return res.status(200).json({ error: validation.error, message: '' });
    const findUser = await findUserByAttributes(validation.value);
    if (findUser.error || !findUser.data) return res.status(200).json({ error: 'data not found', message: 'data not found' });
    return res.status(200).json({ error: null, result: findUser.data });
};

const findUserByAttributes = condition => {
    return new Promise(resolve => {
        User.findOne(condition, (error, data) => {
            if (error) return resolve(error);
            if (data) return resolve({ error: null, data });
            return resolve({ error: null, data: null });
        });
    });
};
module.exports = { create, update, remove, list, login, totalUsers, findByAttr };