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
 	create: function(req,res) {

 		User.findOne({id: req.user.id},function(err,user){
 			var boardParams = {
 				name: req.param('name'),
 				max: req.param('max')
 			};
 			user.boards.add(boardParams);
 			user.save(function(err,board) {
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
 		Board.findOne({id: req.params['id']}).exec(function(err,board) {
 			console.log(board);
 			res.view({
 				board: board
 			})
 		});
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
 		});
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

