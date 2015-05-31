/**
 * BoardsController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	index: function(req,res) {
 		return res.view('boards/index');
 	},
 	new: function(req,res) {
 		return res.view('boards/new');
 	},
 	join: function(req,res) {
 		return res.view('boards/join');
 	}, 	
 	joinGame: function(req,res) {
 		var socket = req.socket;
 		var io = sails.io;
 		Board.find({ where: {isAvailable :true}, limit: 1})
 		.exec(function(err,boards) {
 				var board = boards.length>0 ? boards[0] : {};
 					console.log(board);
 				Board.update( { id: board.id},
 				{
 					joinee: socket.id,
 					isAvailable: false
 				}).exec(function(err,updatedBoards) {
 					console.log('printing borad');
 						console.log(updatedBoards);
 						if(updatedBoards.length  > 0){
 							console.log('joining :'+updatedBoards[0].id);
 								socket.client.board = updatedBoards[0];
 								socket.join(updatedBoards[0].id);
 								socket.broadcast.to(updatedBoards[0].id).emit('joinGame',{message: 'Joined', board: updatedBoards});
 						}else{
 							socket.emit('noroom',{message: 'Wait for some time'});
 						}
 				
 					
 					
 				});
 			});
 		},

 		createGame: function(req,res) {
 			var socket = req.socket;
 			var io = sails.io;
 			Board.create({
 				creator: socket.id,
 				joinee: null
 			}).exec(function(err,board){
 				console.log('created :'+board.id);
 				socket.client.board = board;
 				socket.join(board.id);
 				socket.emit('created',{message: board});
 			});
 		},
 		diceRolled: function(req,res) {
 			var socket = req.socket,
 			io = sails.io,
 			board =socket.client.board;
 			console.log('dice rolled');
 			console.log('publishing:'+board.id);
 			socket.broadcast.to(board.id).emit('message',{number: req.param('number')});
 		}
 	};

