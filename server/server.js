const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;


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
        res.send({todo}).send();
      }
    }).catch((err) => {
      return res.status(400).send();
    });
  }
});

app.listen(port, () => {
  console.log(`Stared server on port ${port}`);
})

module.exports = {app};

/*
mongodb+srv://akash:<mongodbisgood>@cluster0.hu8oa.mongodb.net/<Todos>?retryWrites=true&w=majority
*/
