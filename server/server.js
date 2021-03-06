require('./config/config.js');

const _ = require ('lodash');
const express = require('express');
// takes Json and converts to JavaScript object attaching to req ObjectID
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// using middleware to send Json to Express application
app.use(bodyParser.json());

// Configuring Routes

app.post('/todos', authenticate, (req, res) => {
  // getting data from the client
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  // saving data to db
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

// Returning all todos from db
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// Route for getting Todos
// :id creates a variabile inside req object
app.get('/todos/:id', authenticate, (req, res) => {
  
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    console.log('Id not valid');
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Route for deleting Todo
app.delete('/todos/:id', authenticate, (req, res) => {
  // get the id
  var id = req.params.id; 

  //validate the id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();    
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    // returning the deleted object
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// Route for updating Todo items
app.patch('/todos/:id', authenticate, (req, res) => {
  // get the id
  var id = req.params.id;
  // getting the req object with lodash .pick() method: takes an aboject and pulls off properties (if exist) from mongoose model
  var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    // checking if body.completed is a boolean and exists
    if (_.isBoolean(body.completed) && body.completed) {
      // updating mongoose model (todo.js) inserting initial time on item
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

  // updating the db
  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });  
});

// POST /users
app.post('/users', (req, res) => {
  
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  
  user.save().then(() => {   
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// private route, needs auth with valid x-auth token
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
   });
  // catch fires if no user
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// Route for deleting token from current logged-in user: must be authenticated, so this is is a private route
app.delete('/users/me/token', authenticate, (req, res) => {
  // using instance method from user.js
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.send(400);
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);  
});

module.exports = {app};
