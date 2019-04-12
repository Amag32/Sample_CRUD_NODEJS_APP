const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    fkRole: {
        type: String,
        ref: 'Role'
    },
    module: {
        type: String,
        required: true,
        min: 3,
        max: 15,
    },
    list: {
        type: Boolean,
        defaultValue: false
    },
    view: {
        type: Boolean,
        defaultValue: false
    },
    create: {
        type: Boolean,
        defaultValue: false
    },
    update: {
        type: Boolean,
        defaultValue: false
    },
    removed: {
        type: Boolean,
        defaultValue: false
    },
    createdAt: {
        type: Date, default: Date.now()
    },
    updatedAt: {
        type: Date, default: Date.now()
    }
});
PermissionSchema.index({ fkRole: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);