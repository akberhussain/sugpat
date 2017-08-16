var mongoose = require ("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var patientSchema = new mongoose.Schema({
    
    username: String,
    name: String,
    cnic: String,
    password: String,
    age: Number,
    gender: String,
    address: String,
    bloodgroup: String,
    num: String
});

patientSchema.plugin(passportLocalMongoose);

// patientSchema.plugin(require('mongoose-user-auth'), {
// 	saltWorkFactor: 10, // optional
// 	maxAuthAttempts: 15, // optional
// 	accountLockTime: 3600 // optional
// });

module.exports = mongoose.model("Patient", patientSchema);

