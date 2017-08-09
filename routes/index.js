var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Doctor = require("../models/doctor");


router.get("/",function(req, res){
   res.render("landing"); 
});

router.get("/login",function(req, res){
   res.render("login"); 
});

router.get("/register",function(req, res){
   res.render("register"); 
});

router.get("/profile",function(req, res){
   res.render("profile"); 
});

module.exports = router;