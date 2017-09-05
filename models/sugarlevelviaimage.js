var mongoose = require ("mongoose");


var sugarLevelViaImageSchema = new mongoose.Schema({
    
    image: String,
    patient1:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref : "Patient"
        },
        usernamePatient: String
    }

});



module.exports = mongoose.model("SugarImage", sugarLevelViaImageSchema);

