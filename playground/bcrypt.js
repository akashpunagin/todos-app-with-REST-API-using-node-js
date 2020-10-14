const bcrypt = require('bcryptjs');

var password = "123abc";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log("hash:", hash);
  });
});

var hashedPassword = "$2a$10$JAb2QbBuZ0yTMYJpVDXUPuU7xt98uEpDbLReWZEYDC/Ri6o1f0Bey";

bcrypt.compare(password, hashedPassword, (err, compare) => {
  console.log(compare);
});
