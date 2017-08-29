// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

// http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
// findOneAndUpdate
// _id: new ObjectID("59a57bda6448aaddbcf33797");
// db.collection('Todos').findOneAndUpdate({
// }, {
//   $set: {
//     completed: false
//   }
// }, {
//   returnOriginal: false
// }).then((results) => {
//   console.log(results);
// });

// https://docs.mongodb.com/manual/reference/operator/update/set/, https://docs.mongodb.com/manual/reference/operator/update/inc/
db.collection('Users').findOneAndUpdate({
  _id: new ObjectID("59a3e940dbab80263192b857")
}, {
  $set: {
    name: 'Francesco'
  },
  $inc: {
    age: 1
  }
}, {
  returnOriginal: false
}).then((results) => {
  console.log(results);
});
  // db.close();
});
