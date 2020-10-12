const mongoose = require('mongoose');

// COnfigure mongoose
mongoose.Promise = global.Promise;
const config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
mongoose.connect("mongodb://localhost:27017/TodoApp", config);

module.exports = {mongoose};
