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
 	create: function(req,res) {
 			var boardParams = {
 				name: req.param('name'),
 				max: req.param('max'),
 				owner: req.user.id
 			};
 		Board.create(boardParams,function(err,board){
 		
 			board.players.add(req.user.id);
 			board.save(function(err,board) {
 				console.log(err);
 				if(err){
 					req.flash('message',err.message || err.info);
 					return res.redirect('/boards/new');
 				}else{
 					console.log('returning board: ');
 					console.log(board);

 					return res.redirect('boards/'+board.id);
 				}
 			});
 		});
 	},
 	show: function(req,res) {
 		console.log('showing board: '+req.params['id']);
 		Board.findOne({id: req.params['id']})
 		.populate('players')
 		.populate('owner')
 		.exec(function(err,board) {
 			console.log(board);
 			res.view({
 				board: board
 			})
 		});
 	},
 	/*Socket request*/
 	joinGame: function(req,res) {
 		var socket = req.socket;
 		var io = sails.io;
 		Board.join(	User.findOne({id: req.session.passport.user}),req.param('id'),function(err,board) {
 			if(err){
 				socket.emit('joinGame',{error: 'You have already joined'});
 			}else{
 				socket.join(board.id);
 				io.sockets.in(board.id).emit('joinGame',{board: board, player: req.user});
 			}
 			
 		});
 		/*Board.findOne({id: req.params['id']})
 		.exec(function(err,board) {
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
 					return res.json({message: 'Joined', board: updatedBoards});
 				}else{
 					Board.create({
 						creator: socket.id,
 						joinee: null
 					}).exec(function(err,board){
 						console.log('created :'+board.id);
 						socket.client.board = board;
 						socket.join(board.id);
 						socket.emit('created',{message: board});
 					});
 				}

 			});
 		});*/
 	},

 	diceRolled: function(req,res) {
 		var socket = req.socket,
 		io = sails.io,
 		board =socket.client.board;
 		console.log('dice rolled');
 		console.log('publishing:'+board.id);
 		socket.broadcast.to(board.id).emit('message',{number: req.param('number')});
 	},
 	gameOver: function(req,res) {
 		var socket = req.socket,
 		io = sails.io,
 		board =socket.client.board;
 		socket.broadcast.to(board.id).emit('gameOver',{winner: socket.id});
 	}
 };

