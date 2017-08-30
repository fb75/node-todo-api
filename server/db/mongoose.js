// npm i mongoose --save
var mongoose = require('mongoose');

// connecting Mongoose to MongDB database using Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
