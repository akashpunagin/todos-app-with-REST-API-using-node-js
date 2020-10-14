require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    console.log("Todo Added:", req.body.text);
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {
    Todo.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      } else {
        res.send({todo});
      }
    }).catch((err) => {
      return res.status(400).send();
    });
  }
});

app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  } else {
    Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      } else {
        return res.send({todo});
      }
    }).catch((err) => {
      return res.status(400).send();
    });
  }
});

app.put("/todos/:id", (req, res) => {
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
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      } else {
        return res.send({todo});
      }
    }).catch((err) => {
      return res.status(400).send();
    });
  }
});

app.post("/users", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    console.log("User added: ", body.email);
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(404).send({err});
  });
});

app.listen(port, () => {
  console.log(`Stared server on port ${process.env.PORT}`);
})

module.exports = {app};
