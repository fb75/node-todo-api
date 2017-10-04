var mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// defining Schema for the User model
var UserSchema = new mongoose.Schema({	
    email: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      unique: true,
      validate: {
      	validator: validator.isEmail,
      	isAsync: false,
      	message: '{VALUE} is not a valid email'
      }
    },
    password: {
    	type: String,
    	required: true,
    	minlength: 6
    },
    tokens: [{
    	access: {
    		type: String,
    		required: true
    	},
    	token: {
    		type: String,
    		required: true
    	}
    }]	
});

// converting mongoose Schema to Json 
UserSchema.methods.toJSON = function() {
	var user = this;
	// converting mongoose var into JavaScript regular object
	var userObject = user.toObject();
	// getting only _id and email properties 
	return _.pick(userObject, ['_id', 'email']);
};

// adding instance methods
UserSchema.methods.generateAuthToken = function() {	
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({ access, token });
	return user.save().then(() => {
		return token;	
	});
};

UserSchema.methods.removeToken = function(token) {
	// using MongoDB operator $pull that removes items from arrays respecting certain criteria
	var user = this;
	
	// passing updated object
	return user.update({
		$pull: {
			tokens: {token}
		}
	});
};

// creating custom model method 
UserSchema.statics.findByToken = function(token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch(e) {
	// 	return new Promise((resolve, reject) => {
	// 		reject();
	// 	});
	// }
	return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	// returning chaining promise from server.js
	return User.findOne({email}).then((user) => {
		if (!user) {
			// rejecting promise from server.js
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			// bcrypt.compare password and user.password
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});		
		});
	});
};

// using mongoose middleware to fire event before save event
UserSchema.pre('save', function(next) {
	var user = this;

	// checking if password has been already hashed
	if (user.isModified('password')) {
			var user = this;
			var password = user.password;
			bcrypt.genSalt(10, (err, salt) => {
		 		bcrypt.hash(password, salt, (err, hash) => {
		 		user.password = hash;
		 		next();
		 	});
	 	});
 	}	else {
 		next(); 
 }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
