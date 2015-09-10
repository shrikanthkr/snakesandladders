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
 				LogServices.print(err);
 				if(err){
 					req.flash('message',err.message || err.info);
 					return res.redirect('/boards/new');
 				}else{
 					LogServices.print('returning board: ');
 					LogServices.print(board);

 					return res.redirect('boards/'+board.id);
 				}
 			});
 		});
 	},
 	show: function(req,res) {
 		LogServices.print('showing board: '+req.params['id']);
 		Board.findOne({id: req.params['id']})
 		.populate('players')
 		.populate('owner')
 		.exec(function(err,board) {
 			LogServices.print(board);
 			res.view({
 				board: board
 			})
 		});
 	},
 	/*Socket request*/
 	joinGame: function(req,res) {
 		var socket = req.socket;
 		var io = sails.io,
 		user_id = req.session.passport.user;
 		Board.join(	User.findOne({id: user_id}),req.param('id'),function(err,board) {
 			if(err){
 				LogServices.print(err)
 				socket.emit('joinGame',{error: 'You have already joined'});
 			}else{
 				LogServices.print('Joining Room:'+board.id )
 				socket.join(board.id);
 				BoardServices.metaData(board.toJSON(),function(err,reply,data) {
 					if(err){
 						socket.emit(board.id).emit('joinGame',{error:err});
 					}else{
 						Redis.get({
 							key: board.id
 						},function(err,data) {
 							board.metaData = JSON.parse(data);
 							board.newJoinee = user_id;
 							io.to(board.id).emit('joinGame',{board: board});
 						})
 					}
 				}); 				
 			}
 		});
 	},
 	joinGameRoom: function(req,res) {
 		LogServices.print('Firstttime user join rolled');
 		var socket = req.socket,
 		io = sails.io;
 		socket.join(req.param('id'));
 		Board.findOne({id: req.param('id')}).populate('players').exec(function(err,board){
 			BoardServices.metaData(board.toJSON(),function(err,reply,data) {
 				if(err){
 					res.json({
 							error: err
 						});
 				}else{
 					Redis.get({
 						key: board.id
 					},function(err,data) {
 						board.players.forEach(function(user,index){
 							user.gravatarImage = user.gravatarImage();
 						})
 						board.metaData = JSON.parse(data);
 						res.json({
 							board: board
 						});
 					});
 				}
 			});
 			
 		});
 	},

 	diceRolled: function(req,res) {
 		var socket = req.socket,
 		io = sails.io,
 		board_id = req.param('id'),
 		user_id = req.session.passport.user;
 		number = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
 		LogServices.print('dice rolled');
 		LogServices.print('publishing:');
 		BoardServices.diceCalculations( board_id,user_id,number,function(err,reply) {
 			Redis.get({
 						key: board_id
 					},function(err,data) {
 						var metaData =  JSON.parse(data);
 						io.to(board_id).emit('message',{metaData: metaData});
 					});
 			
 		});
 		
 	},
 	gameOver: function(req,res) {
 		var socket = req.socket,
 		io = sails.io,
 		board =socket.client.board;
 		socket.broadcast.to(board.id).emit('gameOver',{winner: socket.id});
 	}
 };

