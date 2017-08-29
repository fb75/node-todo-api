// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'abc'}).then((result) => {
  //   console.log(result);
  // });


  // findOneandDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });


  // db.collection('Users').deleteMany({nome: 'Francesco'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').findOneAndDelete({age: 22}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID("59a5414e6448aaddbcf32b6c")}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });
  // db.close();
});
