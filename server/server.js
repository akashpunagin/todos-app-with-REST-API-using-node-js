const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();


// Middleware
app.use(bodyParser.json());

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

app.listen(3000, () => {
  console.log("Stared server on port 3000");
})

module.exports = {app};
