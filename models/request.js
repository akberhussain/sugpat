var mongoose = require ("mongoose");

var requestSchema = new mongoose.Schema({
    
    d: String,
    t1: String,
    t2: String,
    availableid: String,
    doctor: {
         id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Doctor"
        },
        username4: String
    },
    patient: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Patient"
        },
        username3: String
    },

});


module.exports = mongoose.model("Request", requestSchema);