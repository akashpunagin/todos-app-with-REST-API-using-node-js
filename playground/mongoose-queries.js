const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// ################# TODOS
// // var id = "5f8494e3adc46a4813db5907"; // NOTE: valid id
// // var id = "6f8494e3adc46a4813db5907"; // NOTE: invalid id
// var id = "5f8494e3adc46a4813db590711"; // NOTE: invalid id
//
//
// if (!ObjectID.isValid(id)) {
//   console.log("ID not valid");
// }

// Todo.find({
//   _id: id, // NOTE: mongoose will convert id to ObjectID
// }).then((todos) => {
//   console.log("todos:", todos);
// });
//
// Todo.findOne({
//   _id: id,
// }).then((todo) => {
//   console.log("todo:", todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     console.log("Id not found");
//   } else {
//   console.log("todo by id:", todo);
//   }
// }).catch((err) => console.log(err));


// ################# USERS
var id = "5f845e16cf7a1e3382a2f0ef"; // NOTE: valid id
// var id = "6f845e16cf7a1e3382a2f0ef"; // NOTE: invalid id
// var id = "6f845e16cf7a1e3382a2f0ef11"; // NOTE: invalid id

User.findById(id).then((user) => {
  if(!user) {
    console.log("Id not valid");
  } else {
    console.log("user by id: ", user);
  }
}).catch((err) => console.log(err));
