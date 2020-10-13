const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.findOneAndRemove()
Todo.findByIdAndRemove("5f855bfee4537220a6cc76de").then((todo) => {
  console.log("todo removed: ", todo);
});
