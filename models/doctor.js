var mongoose = require ("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var doctorSchema = new mongoose.Schema({
    
    name: String,
    cnic: String,
    email:String,
    password: String,
    num: String,
    age: Number,
    qualification: String,
    specialization: String,
    dDescription: String,
    gender: String
});

doctorSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Doctor", doctorSchema);

