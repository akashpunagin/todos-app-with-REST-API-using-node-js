const mongoose = require('mongoose');

// var URI = "mongodb+srv://akash:mongodbisgood@cluster0.hu8oa.mongodb.net/TodosApp?retryWrites=true&w=majority";
var LOCALHOST_URI = "mongodb://localhost:27017/TodoApp";

// COnfigure mongoose
mongoose.Promise = global.Promise;
const config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI || LOCALHOST_URI, config).then(() => {
  console.log("Mongoose connected");
});

module.exports = {mongoose};
