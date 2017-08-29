var mongoose = require ("mongoose");


var sugarLevelSchema = new mongoose.Schema({
    
    date1: String,
    sugarLevel: Number,
    author1:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref : "Patient"
        },
        username1: String
    }
});



module.exports = mongoose.model("SugarLevel", sugarLevelSchema);

