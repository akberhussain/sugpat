var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var Doctor = require("./models/doctor");

// mongoose.connect("mongodb://akber:123abc@ds035965.mlab.com:35965/sugpat");

var promise = mongoose.connect('mongodb://akber:123abc@ds035965.mlab.com:35965/sugpat', {
  useMongoClient: true,
  
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var indexRoutes = require("./routes/index");


app.use(indexRoutes);

app.listen(3000, function(){
    console.log("Visit Hyderabad Server has Started !!");
});