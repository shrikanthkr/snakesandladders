/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var colours = ['#A5CD3E','#FFFFCC','#377D1F','#FE4F4B','#5F584B','#8E836F'];
 module.exports = {
 	metaData: function(board,cb){
 		LogServices.print('Printing Board on Meta Data ')
 		LogServices.print(board)
 		Redis.get({
 			key: board.id
 		},function(err,reply) {
 			var meta = JSON.parse(reply) || {};
 			meta = meta ? meta : {};
 			for(index in board.players){
 				var player = board.players[index];
 				meta[player.id] = meta[player.id] ? meta[player.id]  : {};
 				meta[player.id].colour = meta[player.id].colour || colours[player.id%6];
 				meta[player.id].position = meta[player.id].position || 0;
 				meta[player.id].joinedAt = meta[player.id].joinedAt || new Date().getTime();
 				meta[player.id].state = meta[player.id].state || BoardServices.state.playing;
 			}
 			meta.turn = meta.turn || _.first(board.players).id;
 			Redis.set({
 				key: board.id,
 				value: JSON.stringify(meta)
 			},cb)

 		});
 	},
 	diceCalculations: function(board_id,user_id,position,cb) {
 		Redis.get({
 			key:board_id
 		},function(err,reply) {
 			var meta = JSON.parse(reply) || {};
 			meta = meta ? meta : {};
 			var addedPosition = meta[user_id].position + position,
 			positionChange = /*BoardServices.ladders[addedPosition] || BoardServices.snakes[addedPosition] || */addedPosition;
 			if(positionChange > 100){
 				positionChange =  meta[user_id].position;
 			}
 			if(positionChange === 100){
 				meta[user_id].state =  BoardServices.state.over;
 				positionChange =100;
 			}
 			meta[user_id].position = positionChange;
 			meta.turn = BoardServices.turnCalculations(meta,user_id);
 			LogServices.print(meta);
 			Redis.set({
 				key: board_id,
 				value: JSON.stringify(meta)
 			},cb)
 		});
 	},
 	turnCalculations: function (boardMeta,user_id) {
 		var players = [];

 		delete boardMeta.turn;

 		for(index in boardMeta){
 			boardMeta[index].id = index;
 			players.push(boardMeta[index]);
 		}
 		players = _.sortBy(players, 'joinedAt');
 			LogServices.print(players);
 		for(var i=0;i<players.length;i++){
 			var player = players[i];
 			LogServices.print(player);
 			if(player.id == user_id ){
 				var   expectedPlayer = players[i+1] ? players[i+1] : players[0];
 				LogServices.print(expectedPlayer);
 				LogServices.print(expectedPlayer.state +":"+ BoardServices.state.playing);
 				if(expectedPlayer.state === BoardServices.state.playing)
 					return  expectedPlayer.id;
 			}
 		}
 		return null;
 	},
 	state: {
 		playing: 1,
 		over: 2
 	},
 	snakes : {
 		44:19,
 		46:5,
 		48:9,
 		52:11,
 		55:7,
 		59:17,
 		64:36,
 		69:33,
 		73:1,
 		83:19,
 		92:51,
 		95:24,
 		98:28
 	},
 	ladders :{
 		8: 26,
 		21:82,
 		43:77,
 		50:91,
 		54:93,
 		62:96,
 		66:87,
 		80:100
 	}


 };

