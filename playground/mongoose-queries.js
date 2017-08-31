const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Existing _id of collection
// var id = "59a7cd6c34c36819249ce3051";

// Estabilishing through ObjectId property of ObjectID if _id is valid
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }


// See http://mongoosejs.com/docs/queries.html
// mongoose converts String in ObjectID and returns array of document
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos :', todos);
// });
//
// // returns only one object document, usefull for searching for other properties
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo :', todo);
// });
//
// // returns as above making explicit search of document by id
// Todo.findById(id).then((todo) => {
//   console.log('Todo By Id :', todo);
// });

// Searching for invalid id doesn't throw an error but it returns empty array or with null
// Validating the id
// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id :', todo);
// }).catch((e) => console.log(e));

User.findById("59a675cbbab5d7204e1427bf").then((user) => {
  if (!user) {
    return console.log('User Id not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log('An error is found.', e));
