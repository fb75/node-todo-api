var {User} = require('./../models/user');

// using middleware for private route
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  // using custom mongoose Schema model method
  // takes token value,find user related to that token returning inside promise callback 
  User.findByToken(token).then((user) =>{
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};