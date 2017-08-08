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

module.exports = router;