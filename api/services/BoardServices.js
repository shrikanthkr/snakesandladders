/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var colours = ['#A5CD3E','#FFFFCC','#377D1F','#FE4F4B','#5F584B','#8E836F'];
 module.exports = {
 	metaData: function(board,cb){
 		Redis.get({
 			key: board.id
 		},function(err,reply) {
 			var meta = JSON.parse(reply) || {};
 			meta = meta ? meta : {};
 			for(index in board.players){
 				var player = board.players[index];
 				meta[player.id] = meta[player.id] ? meta[player.id]  : {};
 				meta[player.id].colour = meta[player.id].colour || colours[player.id%6];
 			}
 			meta.turn = meta.turn || _.first(board.players).id;
 			Redis.set({
 				key: board.id,
 				value: JSON.stringify(meta)
 			},cb)
 		});
 	}

 };

