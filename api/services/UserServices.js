/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	userParams: function(req,res){
 		return {
 			 email :req.param('email'),
 			 password :req.param('password'),
 			 passwordConfirmation :req.param('passwordConfirmation')
 		}
 	}

 };

