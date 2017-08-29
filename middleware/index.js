var middlewareObj = {};

middlewareObj.isLoggedIn =  function (req, res, next){
    if(req.user && req.user.bloodgroup){
        return next();
    }
    req.flash("You dont have permissions ! Please Login with correct Email and Password");
    res.redirect("/");
};

middlewareObj.checkIfDoctor = function(req, res, next){
	if(req.user && req.user.specialization){
		return next();
	}
	req.flash("error", "You dont have permissions ! Please Login with correct Email and Password");
	res.redirect("/");	
}

middlewareObj.ifAuthenticatd = function(req, res, next){
	if(req.isAuthenticated()){
		next();
	}
	req.flash("error", "Please Login to see contents of this page");
	res.redirect("back");
}

module.exports = middlewareObj; 