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

      // db.collection("Todos").findOneAndUpdate({
      //   _id: new ObjectID("5f843b675f06142332b97025"),
      // }, {
      //   $set: { completed: true }
      // }, {
      //   returnOriginal: false
      // }).then((result) => {
      //   console.log(result);
      //   client.close();
      // });


      db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("5f841b8455dd15181eda7db1"),
      }, {
        $set: { location: "Antartica" },
        $inc: { age: 1}
      }, {
        returnOriginal: false
      }).then((result) => {
        console.log(result);
        client.close();
      });


    }
  }
);
