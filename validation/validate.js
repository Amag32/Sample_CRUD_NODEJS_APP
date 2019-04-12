const Joi = require('joi');

const validateInput = (input, schema) => {
    return new Promise(resolve => {
        Joi.validate(input, schema, {
            abortEarly: false,
            language: {},
            escapeHtml: true,
            noDefaults: true
        }, (error, value) => {
            if (error) return resolve({
                error: error.details.map(item =>
                    ({ key: item.path[0], value: item.message.replace(new RegExp('"', 'g'), '') })
                )
            });
            return resolve({ error: null, value });
        });
    });
}

module.exports = validateInput;