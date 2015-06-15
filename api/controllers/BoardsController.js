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
 			max: req.param('max') || 2,
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
 				console.log(err)
 				socket.emit('joinGame',{error: 'You have already joined'});
 			}else{
 				console.log('Joining Room:'+board.id )
 				socket.join(board.id);
 				BoardServices.metaData(board.toJSON(),function(err,reply,data) {
 					if(err){
 							socket.emit(board.id).emit('joinGame',{error:err});
 					}else{
 						Redis.get({
 							key: board.id
 						},function(err,data) {
 							board.metaData = JSON.parse(data);
 							io.to(board.id).emit('joinGame',{board: board});
 						})
 					}
 				}); 				
 			}
 		});
 	},
 	joinGameRoom: function(req,res) {
 		console.log('Firstttime user join rolled');
 		var socket = req.socket,
 		io = sails.io;
 		socket.join(req.param('id'));
 		
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

