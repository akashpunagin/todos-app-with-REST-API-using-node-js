// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); // NOTE: This is object destructuring

// Database name
const dbName = "TodoApp";

MongoClient.connect(
  "mongodb://localhost:27017",
  {useUnifiedTopology: true},
  (err, client) => {
    if (err) {
      console.log("Unable to connect to MongoDB server");
    } else {
      console.log("Connected to MongoDB server");

      // Get databasee object from client
      var db = client.db(dbName);

      // deleteMany
      // db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result) => {
      //   console.log(result.result);
      // }, (err) => {
      //   console.log("Unable to delete todos");
      // });


      // deleteOne
      // db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result) => {
      //   console.log(result.result);
      // }, (err) => {
      //   console.log("Unable to delete todo");
      // });

      // findOneAndDelete
      db.collection("Todos").findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
      }, (err) => {
        console.log("Unable to delete todo");
      });


    }
  }
);
