var mongoose = require ("mongoose");

var appointmentSchema = new mongoose.Schema({
    
  appointmenttime1: String,
  appointmenttime2: String,
  appointmentdate: String,

    doctor2: {
         id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Doctor"
        },
        name1: String
    },

    patient2: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Patient"
        },
        name2: String
    },

});


module.exports = mongoose.model("Appointment", appointmentSchema);