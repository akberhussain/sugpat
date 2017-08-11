var mongoose = require ("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var patientSchema = new mongoose.Schema({
    
    username: String,
    name: String,
    cnic: String,
    password: String,
    num: String,
    age: Number
});

patientSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Patient", patientSchema);

