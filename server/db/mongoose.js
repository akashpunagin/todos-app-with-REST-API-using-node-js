const mongoose = require('mongoose');

// Configure mongoose
mongoose.Promise = global.Promise;
const config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};
mongoose.connect(process.env.MONGODB_URI, config).then(() => {
  console.log("Mongoose connected");
});

module.exports = {mongoose};
