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
			type: 'string'
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
	}
};

