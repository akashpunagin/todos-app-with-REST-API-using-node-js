const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// seed data for GET to work
const todos = [{
  _id: new ObjectID(),
  text: "first test",
}, {
  _id: new ObjectID(),
  text: "second test",
}];

// called before all tests
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()); // wipe all data in Todos to test if todos.length is 1 in test
});

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200) // check status code
      .expect((res) => {
        expect(res.body.text).toBe(text); // check request
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // Check database
          Todo.find({text: "Test todo"}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((err) => done(err));
        }
      });
  });

  it("should not create todo with invalid data", (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          // check database
          Todo.find().then((todos) => {
            expect(todos.length).toBe(2);
            done();
          }).catch((err) => done(err));
        }
      });
  });

});

describe("GET /todos", () => {
  it("should GET all todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  });
});

describe("GET /todos:id", () => {
  it("should return todo doc", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non ObjectID", (done) => {
    request(app)
      .get("/todos/123")
      .expect(404)
      .end(done);
  });

});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        } else {
          Todo.findById(id).then((todo) => {
            expect(todo).toBeFalsy();
            done();
          }).catch((err) => done(err));
        }
      });
  });

  it("should return 404 if todo not found", (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if object id is invalid", (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});
