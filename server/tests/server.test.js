const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// seed data for GET to work
const todos = [{
  text: "first test",
}, {
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
