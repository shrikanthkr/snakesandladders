/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
module.exports = {
	attributes: {
		email: {
			type: 'email',
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true
		},
		passwordConfirmation: {
			type: 'string'
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		},
		boards: {
			collection: 'board',
			via :'players'
		},
		my_boards: {
			collection: "board",
      via: "owner"
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

