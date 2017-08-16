var mongoose = require ("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var sugarLevelSchema = new mongoose.Schema({
    
    date1: String,
    sugarLevel: Number,
    user:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref : "Patient"
        },
        username: String
    }
});

sugarLevelSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("SugarLevel", sugarLevelSchema);

