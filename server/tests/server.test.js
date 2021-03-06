const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


// called before all tests
beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo";

    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
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
      .set("x-auth", users[0].tokens[0].token)
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
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done);
  });
});

describe("GET /todos:id", () => {
  it("should return todo doc", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should not return todo doc created by other user", (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non ObjectID", (done) => {
    request(app)
      .get("/todos/123")
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", (done) => {
    var id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
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

  it("should not remove a todo if user is unautherized", (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        } else {
          Todo.findById(id).then((todo) => {
            expect(todo).toBeTruthy();
            done();
          }).catch((err) => done(err));
        }
      });
  });

  it("should return 404 if todo not found", (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if object id is invalid", (done) => {
    request(app)
      .delete(`/todos/123`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PUT /todos/:id", () => {
  it("should udpate todo", (done) =>{
    var id = todos[0]._id.toHexString();
    var text = "this is updated text"
    request(app)
      .put(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({text: text, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).not.toBe(null);
      })
      .end(done);
  });

  it("should not udpate todo if user is unautherized", (done) =>{
    var id = todos[0]._id.toHexString();
    var text = "this is updated text"
    request(app)
      .put(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({text: text, completed: true})
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when todo is not completed", (done) => {
    var id = todos[1]._id.toHexString();
    var text = "this is updated text for second entry"
    request(app)
      .put(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({text: text, completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});


describe("GET /users/me", () => {
  it("should return user if authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return a 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res => {
        expect(res.body).toEqual({});
      }))
      .end(done);
  });
});


describe("POST /users", () => {
  it("should create a user", (done) => {
    var email = "example@gmail.com";
    var password = "123abcd";

    request(app)
      .post("/users")
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        } else {
          User.findOne({email}).then((user) => {
            expect(user).toBeDefined();
            expect(user.password).not.toBe(password);
            done();
          }).catch((err) => done(err));
        }
      });
  });

  it("should return validation errors if request is invalid", (done) => {
    request(app)
      .post("/users")
      .send({email: "egg", password: "123"})
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", (done) => {
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "123451212"
      })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("should login user and return auth token", (done) => {
    request(app)
      .post("/users/login")
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        } else {
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          }).catch((err) => done(err));
        }
      });
  });

  it("should reject invalid login", (done) => {
    request(app)
      .post("/users/login")
      .send({email: users[1].email, password: "1212121"})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        } else {
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1);
            done();
          }).catch((err) => done(err));
        }
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", (done) => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        } else {
          User.findById(users[0]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((err) => done(err));
        }
      });
  });
});
