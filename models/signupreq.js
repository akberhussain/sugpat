var mongoose = require ("mongoose");

var signupRequestSchema = new mongoose.Schema({
    
    username: { type: String, required: true, index: { unique: true }},
    name: String,
    cnic: String,
    password: { type: String, required: true },
    age: Number,
    gender: String,
    heridity: String,
    drughistory: String,
    diabetesduration: String,
    address: String,
    bloodgroup: String,
    num: String,
    profilepic: String
});

module.exports = mongoose.model("SignupRequest", signupRequestSchema);