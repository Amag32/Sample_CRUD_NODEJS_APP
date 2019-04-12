const Joi = require('joi');

const validateInput = require('./validate');

// Start: Validation schema

// Define schema for creating a User Role.
const createUpdateSchema = Joi.object().keys({
    name: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('Name'),
    status: Joi.number().valid(0, 1).required().label('Status')
});

// Define schema for removing an existing Role.
const removeSchema = Joi.object().keys({
    _id: Joi.string().required().label('Resource id')
});


// Validate Schema
const validateCreateUpdateInput = async (input) => await validateInput(input, createUpdateSchema);
const validateRemoveInput = async (input) => await validateInput(input, removeSchema);

// Set Permission on Methods for accessing out side.
module.exports = {
    validateCreateUpdateInput,
    validateRemoveInput
}