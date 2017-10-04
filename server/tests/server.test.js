const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



// Populating the db with objects then start testing
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  // assertions on status and body as specified above
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';
    // controlling post request sending data
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
      expect(res.body.text).toBe(text);
    }).end((err,res) => {
      if (err) {
        return done(err);
      } // using .find method (not the mongodb method) to see if todos exist on db
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });
  // assertion to verifying correct todo data
  it('Should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

  // single test case
  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  // testing valid id
  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          // assertion with expect library
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      // make sure 404 back
      var Id = new ObjectID().toHexString();
      request(app)
        .get(`/todos/${Id}`)
        .expect(404)
        .end(done);
        });
    });

   it('should return 404 for non-object ids', (done) => {
     request(app)
     .get('/todos/123abc')
     .expect(404)
     .end(done);
   });
});

// Testing deleted item from collection
describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    // if status 200 expecting response object id to be the one selected
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if (err) {
        // if error occurs Mocha throws back
        return done(err);
      }
      // query db using findById on hexId expecting nothing back
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));

    });
  });

  it('should return 404 if todo not found', (done) => {
    var Id = new ObjectID().toHexString();
      request(app)
        .delete(`/todos/${Id}`)
        .expect(404)
        .end(done);
        });
  it('should return 404 if ObjectID is invalid', (done) => {
    request(app)
    .delete('/todos/123abc')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    var firstId = todos[0]._id.toHexString();   
    // update text, set completed true send data into req body
    request(app)
      .patch(`/todos/${firstId}`)
      .send({
        completed: true,
        text: 'Some other text'
      })      
      .expect(200)
      // verify res body has text changed and completed is true completedAt is a number .toBeA (expect method)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Some other text');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })      
      .end(done);      
      });

  
  it('should completedAt when todo is not completed', (done) => {
    // get id of second todo item
    var secondId = todos[1]._id.toHexString();
    let text = `Some text`;
    // update text, set completed to false
    request(app)
      .patch(`/todos/${secondId}`)
      .send({
        text,
        completed: false
      })
    // 200
    .expect(200)
    // res body text changed, completed is false, completedAt is null 
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();      
    })
    .end(done);
  });
});  

// testing authenticated and not authenticated get routes
describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    // using supertest
    request(app)
    .get('/users/me')
    // setting header in supertest passing header name and value
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      // expecting id is appropriate
      expect(res.body._id).toBe(users[0]._id.toHexString());
      // and email matches
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done);
    // body .toEqual empty
  });
});

describe('POST /users', () => {
  // testing valid data
  it('should create a user', (done) => {
    var email = 'user@example.com';
    var password = '123scl!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email)
    })
    .end((err) => {
      if (err) {
        return done(err);
      }

      // checking users for same email
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation error if request is invalid', (done) => {
    // sending bad email and password
    request(app)
    .post('/users')
    .send({
      email: 'x',
      password: '12a@a'
    })    
    // expecting status 400
    .expect(400)
    .end(done);
  });

  it('should not create email if email in use', (done) => {
    // taking email already in use from users
    request(app)
    .post('/users')
    .send({
      email: users[0].password,
      password: 'mypass!' 
    })
    // expecting status 400
    .expect(400)
    .end(done);    
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          // verifyin the user[0] has at least those properties
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.header['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
        
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });

  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)   
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));

    });
    // DELETE /users/me/token
    // Set x-auth token = token
    // 200
    // Find user, verify that tokens array has length of zero
  });
});