/**
* Boards.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require('moment');
module.exports = {
	tableName: "boards",
	autoPK: true,
	attributes: {
		name: {
			type: 'string',
			defaultsTo: 'Default'
		},
		max: {
			type: 'integer',
			defaultsTo: 2
		},
		current: {
			type: 'integer',
			defaultsTo: 1
		},
		isAvailable: {
			type: 'boolean',
			defaultsTo: true
		},
		players : {
			collection: 'user',
			via: 'boards'
		},
		owner: {
			model: 'user'
		},
		formattedDate: function() {
			return moment(this.createdAt).fromNow();
		},
		toJSON: function() {
			var obj = this.toObject();
			obj.formattedDate = obj.formattedDate().toString();
			return obj;
		}

	},
	join : function(User,board_id,cb) {
		User.exec(function(err,user){
			Board.findOne({id: board_id}).exec(function(err,board) {
				if(err){
					console.log(err);
					cb(err);
				}else{
					console.log(board);
					if(board.current +1 <=board.max  ){
						board.current  = board.current + 1;
						board.players.add(user);
						board.save(cb);
					}else{
						console.log('Max reached');;
						cb({message: 'Max players Reached'},null);
					}
				}

			});
		});
		
	}
};

