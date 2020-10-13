const mongoose = require('mongoose');

var URI = "mongodb+srv://akash:mongodbisgood@cluster0.hu8oa.mongodb.net/Todos?retryWrites=true&w=majority";
// var URI = "mongodb://localhost:27017/TodoApp"

// COnfigure mongoose
mongoose.Promise = global.Promise;
const config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(URI, config);

module.exports = {mongoose};
