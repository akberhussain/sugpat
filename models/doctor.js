var mongoose = require ("mongoose");
var bcrypt = require("bcrypt-nodejs");

var passportLocalMongoose = require("passport-local-mongoose");

var doctorSchema = new mongoose.Schema({
    
    username: { type: String, required: true, index: { unique: true }},
    cnic: String,
    name:String,
    password: { type: String, required: true },
    num: String,
    age: Number,
    qualification: String,
    specialization: String,
    description: String,
    gender: String,
    address: String,
    profilepic: String
});

// doctorSchema.plugin(passportLocalMongoose);

// doctorSchema.plugin(require('mongoose-user-auth'), {
//     saltWorkFactor: 10, // optional 
//     maxAuthAttempts: 15, // optional 
//     accountLockTime: 3600 // optional 
// });



doctorSchema.pre('save',function(next){
  const doctor = this;
  if (!doctor.isModified('password')) return next();
  bcrypt.genSalt(10,function(err,salt){
    if(err) return next(err);
    bcrypt.hash(doctor.password,salt,null,function(err,hash){
      if(err) return next(err)
      doctor.password = hash;
      next();
    })
  })
})

doctorSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
    //Return either True or False
}





module.exports = mongoose.model("Doctor", doctorSchema);

// module.exports.createUser = function(newUser, callback){
//     bcrypt.genSalt(10, function (err, salt){
//         bcrypt.hash(newUser.password, salt, function(err, hash){
//             newUser.password= hash;
//             newUser.save(callback);
//         });
//     });
// }

// module.exports.getPatientByUsername = function(username, callback){
//     var query = {username: username};
//     Doctor.findOne(query, callback);
// }

// module.exports.getPatientById = function(id, callback){
//     Doctor.findById(id, callback);
// }

// module.exports.comparePass = function(candidPassword, hash, callback){
//     bcrypt.compare(candidPassword, hash, function(err, isMatch){
//         if(err) throw err;
//         callback (null, isMatch);
//     });
// }