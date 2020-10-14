const {SHA256} = require('crypto-js');

var message = "user number3"
var salt = "somesecret";
var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

var data = {
  id: 4,
};
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + salt).toString(),
}

// Man in the middle
// token.data.id = 5;
// token.data.hash = SHA256(JSON.stringify(data)).toString();


var resultHash = SHA256(JSON.stringify(data) + salt).toString();
if (resultHash === token.hash) {
  console.log("Data was not changed");
} else {
  console.log("Data was changed, don't trust");
}
