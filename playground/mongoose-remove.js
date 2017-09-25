const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Methods for deleting records: 

// Deleting all Todo from db: 
// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

// Finds only first document and remove it, returns also data to be used, print it or send it back
// Todo.findOneAndRemove

// Passing Id of the argument and it will be removed and retunrs the doc
// Todo.findByIdAndRemove

// Todo.findByIdAndRemove('59c7c683f884fee957f5538d').then((todo) => {
// 	console.log(todo);
// });

// Passing query object
Todo.findOneAndRemove({_id: '59c7c683f884fee957f5538d'}).then((todo) => {

});