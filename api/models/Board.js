/**
* Boards.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoPK: true,
	attributes: {
		creator: {
			type: 'string'
		},
		joinee: {
			type: 'string'
		},
		isAvailable: {
			type: 'boolean',
			defaultsTo: true
		}
	}
};

