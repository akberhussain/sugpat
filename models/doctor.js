var mongoose = require ("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var doctorSchema = new mongoose.Schema({
    
    name: String,
    cnic: String,
    email:String,
    password: String,
    num: Number,
    age: Number,
    specialization: String,
    dDescription: String,
    gender: String
});

doctorSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Doctor", doctorSchema);

