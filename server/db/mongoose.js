// npm i mongoose --save
var mongoose = require('mongoose');

// connecting Mongoose to MongDB database using Promise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

module.exports = {mongoose};
