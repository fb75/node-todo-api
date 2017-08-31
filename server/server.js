var express = require('express');
// takes Json and converts to JavaScript object attaching to req ObjectID
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

// using middleware to send Json to Express application
app.use(bodyParser.json());

// Configuring Routes

app.post('/todos', (req, res) => {
  // getting data from the client
  var todo = new Todo({
    text: req.body.text
  });
  // saving data to db
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

// Returning all todos from db
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
