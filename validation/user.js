const Joi = require('joi');

const validateInput = require('./validate');

// Starts: Validation schema

// Define schema for creating an User.
const createSchema = Joi.object().keys({
    fkRole: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('Role'),
    fname: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('First Name'),
    lname: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('Last Name'),
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().min(6).max(15).required().trim().label('Password'),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
        language: {
            any: {
                allowOnly: '!!Passwords do not match',
            }
        }
    }).label('Confirm Password'),
    verify: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('Verify'),
    code: Joi.string().max(32).required().trim().label('Code'),
    status: Joi.number().valid(0, 1).required().label('Status')
});

// Define schema for updating an existing user.
const updateSchema = Joi.object().keys({
    fkRole: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('Role'),
    fname: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('First Name'),
    lname: Joi.string().min(3).max(15).required().trim().regex(/^[\w\-\s]+$/)
        .options({
            language: {
                string: {
                    regex: {
                        base: 'only alphabets are allowed.'
                    }
                }
            }
        }).label('Last Name'),
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().min(6).max(15).trim().allow('').optional().label('Password'),
    confirmPassword: Joi.string().valid(Joi.ref('password')).optional().options({
        language: {
            any: {
                allowOnly: '!!Passwords do not match',
            }
        }
    }).label('Confirm Password'),
    verify: Joi.boolean().truthy('true').falsy('false').insensitive(false).label('Verify'),
    code: Joi.string().max(32).required().trim().label('Code'),
    status: Joi.number().valid(0, 1).required().label('Status')
});

// Define schema for removing an existing user.
const removeSchema = Joi.object().keys({
    _id: Joi.string().required().label('Resource id')
});

// Define schema for loging user.
const loginSchema = Joi.object().keys({
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().min(6).max(15).required().trim().label('Password')
});


/**
 * Call funcations.
 */
const validateCreateInput = async (input) => await validateInput(input, createSchema);
const validateUpdateInput = async (input) => await validateInput(input, updateSchema);
const validateRemoveInput = async (input) => await validateInput(input, removeSchema);
const validateLoginInput = async (input) => await validateInput(input, loginSchema);

// Set Permission on Methods for accessing out side.
module.exports = {
    validateCreateInput,
    validateUpdateInput,
    validateRemoveInput,
    validateLoginInput
}