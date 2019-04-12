const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 15,
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

module.exports = mongoose.model('Role', RoleSchema);