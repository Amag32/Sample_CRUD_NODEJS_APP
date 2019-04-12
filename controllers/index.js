const services = require('../services');

const actions = (req, res, next) => services[req.headers.service][req.headers.method](req, res, next);

module.exports = { actions };