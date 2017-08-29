var mongoose = require ("mongoose");

// var passportLocalMongoose = require("passport-local-mongoose");

var availablitySchema = new mongoose.Schema({
    
    date: String,
    time1: String,
    time2: String,

    author:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref : "Doctor"
        },
        username2: String
    }
});

// availablitySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Available", availablitySchema);