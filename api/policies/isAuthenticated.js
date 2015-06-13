module.exports = function(req, res, next) {
	if(req.isSocket){
		return next();
	}else{
		if (req.isAuthenticated()) {
			return next();
		}
		else{
			return res.redirect('/');
		}
	}
	
};
