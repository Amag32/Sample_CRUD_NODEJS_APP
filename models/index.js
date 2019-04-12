const mongoose = require('mongoose');

module.exports.connect = uri => {
    mongoose.connect(uri, { useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);
    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    });

    // load models
    require('./User');
    require('./Role');
    require('./Permission');
};
