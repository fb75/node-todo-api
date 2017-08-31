const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

// Populating the db with objects
beforeEach((done) => {
  Todo.remove({}).then(() =>  {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
