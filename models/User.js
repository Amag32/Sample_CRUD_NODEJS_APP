const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fkRole: {
        type: String,
        ref: 'Role'
    },
    fname: {
        type: String,
        required: true,
        min: 3,
        max: 15,
    },
    lname: {
        type: String,
        required: true,
        min: 3,
        max: 15,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 150
    },
    password: {
        type: String,
        required: true,
        max: 150,
    },
    verify: {
        type: Boolean,
        defaultValue: false
    },
    code: {
        type: String,
        max: 32,
        defaultValue: ''
    },
    status: {
        type: Number, default: 0
    },
    createdAt: {
        type: Date, default: Date.now()
    },
    updatedAt: {
        type: Date, default: Date.now()
    }
});

module.exports = mongoose.model('User', UserSchema);