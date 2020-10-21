require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/todos", authenticate, async  (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  try {
    const todoDoc = await todo.save();
    console.log("Todo Added:", req.body.text);
    res.send(todoDoc);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/todos", authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({_creator: req.user._id});
    res.send({todos});
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/todos/:id", authenticate, async (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {

    try {
      const todo = await Todo.findOne({
        _id: id,
        _creator: req.user._id,
      });
      if (!todo) {
        return res.status(404).send();
      } else {
        res.send({todo});
      }
    } catch (e) {
      return res.status(400).send();
    }
  }
});

app.delete("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {
    try {
      const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id,
      });
      if (!todo) {
        return res.status(404).send();
      } else {
        return res.send({todo});
      }
    } catch (e) {
      return res.status(404).send();
    }
  }
});

app.put("/todos/:id", authenticate, async (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    try {
      const todo = await Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id,
      },
      {$set: body},
      {new: true});

      if (!todo) {
        return res.status(404).send();
      } else {
        return res.send({todo});
      }
    } catch (e) {
      return res.status(400).send();
    }
  }
});

app.post("/users", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    console.log("User added: ", body.email);
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send({err});
  }
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.post("/users/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Stared server on port ${process.env.PORT}`);
})

module.exports = {app};
