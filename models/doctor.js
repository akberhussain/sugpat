var mongoose = require ("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var doctorSchema = new mongoose.Schema({
    
    username: String,
    cnic: String,
    name:String,
    password: String,
    num: String,
    age: Number,
    qualification: String,
    specialization: String,
    description: String,
    gender: String
});

// doctorSchema.plugin(passportLocalMongoose);

doctorSchema.plugin(require('mongoose-user-auth'), {
    saltWorkFactor: 10, // optional 
    maxAuthAttempts: 15, // optional 
    accountLockTime: 3600 // optional 
});
module.exports = mongoose.model("Doctor", doctorSchema);

