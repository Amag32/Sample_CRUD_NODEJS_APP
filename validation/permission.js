const Joi = require('joi');

const validateInput = require('./validate');

// Starts: Validation schema
const createUpdateSchema = Joi.object().keys({
    fkRole: Joi.string().required().trim().label('Role'),
    module: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('Module'),
    list: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('List'),
    view: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('View'),
    create: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('Create'),
    update: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('Update'),
    removed: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('Delete')
});

// Define schema for remove an existing user.
const removeSchema = Joi.object().keys({
    _id: Joi.string().required().label('Resource id')
});


// Validate Schema.
const validateCreateUpdateInput = async (input) => await validateInput(input, createUpdateSchema);
const validateRemoveInput = async (input) => await validateInput(input, removeSchema);

// Set Permission on Methods for accessing out side.
module.exports = {
    validateCreateUpdateInput,
    validateRemoveInput
}