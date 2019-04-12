const route = require('express').Router();
const controllers = require('../controllers');

route.post('/api/*', (req, res, next) => {
    try {
        controllers.actions(req, res, next);
    } catch (e) {
        res.send("Request does not exists");
    }
});

module.exports = route;