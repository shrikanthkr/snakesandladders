/**
* Boards.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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
					if(board.max <= board.current +1 ){
						console.log('Max reached');;
						cb({message: 'Max players Reached'},null);
					}else{
						Board.update({id: board.id},{max:board.max+1}).exec(function afterwards(err, updated){
							if (err) {
								cb(err);
							}
							board.players.add(user);
							board.save(cb);
							console.log('Updated user to have name ' + updated[0].name);
						});

					}
				}

			});
		});
		
	}
};

