const jwt = require('jsonwebtoken');

// jwt.sign - takes object and signs it ie takes the object, creates hash and return token value
// jwt.verify - takes token and secret and confirms object was not manipulated

var secret = "123abc";

var data = {
  id: 10
}
var token = jwt.sign(data, secret);
console.log("Token: ", token);

var decoded = jwt.verify(token, secret);
console.log("Decoded: ", decoded);
