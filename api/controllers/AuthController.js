/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
module.exports = {
	_config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    login: function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                try{
                    req.flash('message', info.message.toString());
                }catch(e){
                     req.flash('message', 'Invalid Login');
                }
            	
            	 return res.redirect('/');
            }
            req.logIn(user, function(err) {
                if (err) res.send(err);
                console.log('!!!!!!!!!!!!!')
                console.log(req.user)
                console.log('!!!!!!!!!!!!!')
                return res.redirect('/dashboard');
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        res.redirect('/');
    }
};

