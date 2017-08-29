var mongoose = require ("mongoose");

var signupRequestSchema = new mongoose.Schema({
    
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

module.exports = mongoose.model("SignupRequest", signupRequestSchema);