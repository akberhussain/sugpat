var mongoose = require ("mongoose");
var bcrypt = require("bcrypt-nodejs");

var passportLocalMongoose = require("passport-local-mongoose");

var patientSchema = new mongoose.Schema({
    
    username: String,
    name: String,
    cnic: String,
    password: String,
    age: Number,
    gender: String,
    address: String,
    bloodgroup: String,
    num: String,
});

// patientSchema.plugin(passportLocalMongoose);

// patientSchema.plugin(require('mongoose-user-auth'), {
// 	saltWorkFactor: 10, // optional
// 	maxAuthAttempts: 15, // optional
// 	accountLockTime: 3600 // optional
// });



patientSchema.pre('save',function(next){
  var patient = this;

    // if (patient.isModified('password')) return next();
      bcrypt.genSalt(10,function(err,salt){
    
    if(err) return next(err);
    bcrypt.hash(patient.password,salt,null,function(err,hash){
      if(err) return next(err)
      patient.password = hash;
      next();
    })
  })
});
  
patientSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
    //Return either True or False
}




module.exports = mongoose.model("Patient", patientSchema);

// module.exports.createUser = function(newUser, callback){
// 	bcrypt.genSalt(10, function (err, salt){
// 		bcrypt.hash(newUser.password, salt, function(err, hash){
// 			newUser.password= hash;
// 			newUser.save(callback);
// 		});
// 	});
// }

// module.exports.getPatientByUsername = function(username, callback){
// 	var query = {username: username};
// 	Patient.findOne(query, callback);
// }

// module.exports.getPatientById = function(id, callback){
// 	Patient.findById(id, callback);
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
// 	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
// 		if(err) throw err;
// 		callback (null, isMatch);
// 	});
// }