var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var middleware = require("../middleware");


router.get("/",function(req, res){
   
   res.render("landing"); 
});

router.get("/removeall", function(req, res){
	Patient.remove({}, function(err){
			if(err){
				console.log(err);
			}
			console.log("removed all the patients from database")
		})
	res.send("removed all the patients from database");
})


router.get("/login",function(req, res){
   res.render("login"); 
});

router.get("/register",function(req, res){
   res.render("register"); 
});

router.get("/profile", middleware.isLoggedIn ,function(req, res){
   res.render("profile"); 
});

	

router.get("/signup", function(req, res){
	res.render("signup");
})


router.post("/signup", function(req, res) {
    Patient.register(new Patient({username: req.body.username, name : req.body.name, cnic: req.body.cnic, num: req.body.num, age: req.body.age}), 
    	req.body.password, function(err, patient){
        if(err){
           // req.flash("error", err.messge);
            res.send(err);
        }
        passport.authenticate("local")(req, res, function(){    
            req.flash("success", "Welcome to Sugpat " + req.body.username);  
            res.redirect("/profile");
        });
    });
});


router.post("/register", function(req, res){
    Doctor.register(new Doctor({username: req.body.username, name: req.body.name, cnic: req.body.cnic, num: req.body.num, age: req.body.age, qualification: req.body.qualification, specialization: req.body.specialization, description: req.body. description, gender: req.body.gender}),
        req.body.password, function(err, doctor){
            if(err){
                res.send(err)
            }
            //req.logout();
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Doctor Sucessfully Added");
                res.redirect("/profile");
            });
            // req.flash("success", "Doctor Sucessfully Added");
            // res.redirect("/profile");
        });
});


router.post("/login",passport.authenticate("local", {

    successRedirect: "/profile",
    failureRedirect: "/login"
}) ,function(req, res) {
    console.log(req.user.name);
});



// logout User

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Sucessfully logged you out !!!");
    res.redirect("/login");
    
});



function checkIfAdmin(req, res, next){

    if(req.isAuthenticated()){
        var obj = {
            a:'598c61dccc270c10acb2833d'
        };
        if(req.user._id.equals(obj.a)){
            next();
        }
        else{
            req.flash("error", "Your You do not have permission to Access the route !!!");
            res.redirect("/login");
        }
    }
    else{
        console.log("Login to Continue");
        res.redirect("/login");
    }
}


module.exports = router;