const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/bruhgram_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "error connecting to mongodb"));

db.once('open', function () {
    console.log('connected to db');
    module.exports = db;
});
