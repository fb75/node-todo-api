var express = require('express');
// takes Json and converts to JavaScript object attaching to req ObjectID
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
  // using something off the req
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

// Route for deleting Todo
app.delete('/todos/:id', (req, res) => {
  // get the id
  var id = req.params.id; 

  //validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();    
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    // returning the deleted object
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`);  
});

module.exports = {app};
