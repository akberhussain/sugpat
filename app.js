console.log("asa");
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var localStrategy = require("passport-local");
// var localStrategy1 = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var Doctor = require("./models/doctor");
var Patient = require("./models/patient");

// mongoose.connect("mongodb://akber:123abc@ds035965.mlab.com:35965/sugpat");

var promise = mongoose.connect('mongodb://akber:123abc@ds035965.mlab.com:35965/sugpat', {
  useMongoClient: true,

});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

var indexRoutes = require("./routes/index");
// app.use(indexRoutes);


app.use(require("express-session")({
    secret: "this is yelp_camp app",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Patient.authenticate()));
passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());
// passport.use(new localStrategy1(Doctor.authenticate()));
// passport.serializeUser(Doctor.serializeUser());
// passport.deserializeUser(Doctor.deserializeUser());


// if(Patient.authenticate()=="Unauthorized"){
//   console.log("unauthorized");
//   passport.use(new localStrategy(Doctor.authenticate()));
//   passport.serializeUser(Doctor.serializeUser());
//   passport.deserializeUser(Doctor.deserializeUser());

// }






// passport.use(new localStrategy(
//   function(username, password, role, done) {
//     Patient.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       // if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

// passport.use(new localStrategy(Patient.authenticate()));
// passport.serializeUser(Patient.serializeUser());
// passport.deserializeUser(Patient.deserializeUser());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(Doctor.authenticate()));
// passport.serializeUser(Doctor.serializeUser());
// passport.deserializeUser(Doctor.deserializeUser());




app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);


app.listen(3000, function(){
    console.log("sugpat Server has Started on port 3000 !!");
});