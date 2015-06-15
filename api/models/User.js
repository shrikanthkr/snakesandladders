/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt'),
gravatar = require('gravatar');
module.exports = {
	attributes: {
		name:{
			type: 'string'
		},
		email: {
			type: 'email',
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true
		},
		boards: {
			collection: 'board',
			via :'players'
		},
		my_boards: {
			collection: "board",
      via: "owner"
		},
		gravatarImage: function() {
			return gravatar.url(this.email).toString();
		},
		toJSON: function() {
			var obj = this.toObject();
			if(typeof obj.gravatarImage == 'function'){
				obj.gravatarImage = obj.gravatarImage();
			}
			delete obj.password;
			return obj;
		}
	},
	validateAndCreate: function(user,cb) {
		if (user.password === user.passwordConfirmation) {
			this.create(user).exec(cb);
		} else{
			cb({message: 'Password does not match'},null);
		};
	},
	beforeCreate: function(user, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					console.log(err);
					cb(err);
				} else {
					user.password = hash;
					cb();
				}
			});
		});
	}
};

