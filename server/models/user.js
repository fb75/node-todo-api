var mongoose = require('mongoose');
var validator = require('validator');
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

// converting to Json mongoose Schema
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

// creating custom 
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

var User = mongoose.model('User', UserSchema);

module.exports = {User};
