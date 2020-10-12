// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb"); // NOTE: This is object destructuring

// Making a new object id
// var objId = new ObjectID();
// console.log(objId);

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

      // // Add data to TodoApp database
      db.collection("Todos").insertOne({
        text: "Eat lunch",
        completed: false,
      }, (err, result) => {
        if (err) {
          console.log("Unable to insert todo", err);
        } else {
          console.log(JSON.stringify(result.ops, undefined, 2));
          client.close();
        }
      });

      // db.collection("Users").insertOne({
      //   name: "Akash",
      //   age: 20,
      //   location: "Navanagar, Hubballi"
      // }, (err, result) => {
      //   if (err) {
      //     console.log("Unable to insert todo", err);
      //   } else {
      //     console.log(JSON.stringify(result.ops, undefined, 2));
      //     console.log(`Created At: ${result.ops[0]._id.getTimestamp()}`);
      //     client.close();
      //   }
      // });

    }
  }
);
