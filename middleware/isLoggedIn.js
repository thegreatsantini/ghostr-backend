module.exports = function(req, res, next){
	if(!req.user){
		req.flash('error', 'You are not authorized to view this page. Please login.');
		res.redirect(process.env.FRONTEND_URL);
		// res.redirect('/auth/login');
	} else {
		next();
	}
}