const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// to run the test the todo must be = 0 in the db
beforeEach((done) => {
  Todo.remove({}).then(() =>  done());
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
      Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });

  });
});
