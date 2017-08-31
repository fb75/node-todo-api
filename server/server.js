var express = require('express');
// takes Json and converts to JavaScript object attaching to req ObjectID
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

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

// GET /todos/12345678
// :id creates a variabile inside req object
app.get('/todos/:id', (req, res) => {
  // using somthing off the req
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    console.log('Id not valid');
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
