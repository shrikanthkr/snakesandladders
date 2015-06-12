/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	new: function(req,res) {
 		return res.view('users/new');
 	},
 	create :function(req,res) {
 		var params = UserServices.userParams(req,res);
 		User.validateAndCreate(params,function (err, user){
 			if(err){
 				req.flash('message',err.message || err.info);
 				return res.redirect('/users/new');
 			}else{
 				console.log('Created user with name ' + user.email);
 				req.flash('message', 'Successfully Signed up Please login');
 				return res.redirect('/');
 			}
 		});
 	}
};

