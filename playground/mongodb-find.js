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

      // // Fetch all documents
      // db.collection('Todos').find().toArray().then((docs) => {
      //   console.log("Todos");
      //   console.log(JSON.stringify(docs, undefined, 2));
      // }, (err) => {
      //   console.log("Unable to fetch todos", err);
      // });

      // Fetch documents by field
      // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
      //   console.log("Todos");
      //   console.log(JSON.stringify(docs, undefined, 2));
      // }, (err) => {
      //   console.log("Unable to fetch todos", err);
      // });

      // Fetch documents by ObjectID
      db.collection('Todos').find({
        _id: new ObjectID('5f843b675f06142332b97025') ,
      }).toArray().then((docs) => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
        client.close();
      }, (err) => {
        console.log("Unable to fetch todos", err);
      });

      // document count
      // db.collection('Todos').find().count().then((count) => {
      //   console.log(`Todos Count: ${count}`);
      // }, (err) => {
      //   console.log("Unable to fetch todos", err);
      // });


    }
  }
);
