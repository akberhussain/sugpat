var express = require("express");
var router  = express.Router();
var passport = require("passport");
var localStrategy = require("passport-local").Strategy
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var middleware = require("../middleware");
var SugarLevel = require("../models/sugarlevel");
var Available = require("../models/available");
var Request = require("../models/request");
var Appointment = require("../models/appointment");
var SignupRequest = require("../models/signupreq");
var SugarImage = require("../models/sugarlevelviaimage");
var multer = require('multer');
var upload = multer({dest: './public/uploads/img/'})
var okrabyte = require("okrabyte");
// var storage = multer.memoryStorage()
// var upload = multer({ storage: storage })
// var storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, '/tmp/my-uploads')
  // },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// var upload = multer({ storage: storage })


router.get("/",function(req, res){
    res.render("landing");   
});



// router.get("/removeall", function(req, res){
//     Patient.remove({}, function(err){
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed all the patients from database")
//         })
//     res.send("removed all the patients from database");
// })

// router.get("/removeallsugar", function(req, res){
//     SugarLevel.remove({}, function(err){
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed all the sugarlevels from database")
//         })
//     res.send("removed all the sugarlevels from database");
// })

// router.get("/removeallschedules", function(req, res){
// 	Available.remove({}, function(err){
// 			if(err){
// 				console.log(err);
// 			}
// 			console.log("removed all the Schedules from database")
// 		})
// 	res.send("removed all the Schedules from database");
// })


router.get("/login",function(req, res){
   res.render("login"); 
});


router.get("/doctorlogin",function(req, res){
   res.render("dlogin"); 
});

router.get("/register", checkIfAdmin ,function(req, res){
   res.render("register"); 
});

router.get("/aboutme", middleware.isLoggedIn, function(req, res){
   res.render("basicinfo"); 
});


router.get("/basicinfo", middleware.checkIfDoctor, function(req, res){
   res.render("doctorbasicinfo"); 
});


router.get("/patients", checkIfAdmin ,function(req, res){

    Patient.find({}, function(err, patients){
       res.render("patients", {patients: patients}); 
    })
});

router.delete("/removepatient:id", checkIfAdmin, function(req, res){
    Patient.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        req.flash("success", "Patient successfully Removed");
        res.redirect("back"); 
    });
});


router.delete("/deletedoctor:id",checkIfAdmin, function(req, res){
    Doctor.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        req.flash("success", "Doctor successfully Removed");
        res.redirect("back"); 
    });
});    

router.get("/requests", checkIfAdmin ,function(req, res){

    Request.find({}, function(err, foundRequest){
        if(err){
            console.log(err);
        } else{
            res.render("requests", {foundRequest: foundRequest})
                        
            
        }
    })
});

router.get("/myaccount:id", middleware.isLoggedIn , function(req, res){
    Patient.findById(req.params.id, function(err, patient){
        res.render("editpatient", {patient: patient});
    });
});

router.put("/myaccount:id", middleware.isLoggedIn, function(req, res){

        Patient.findByIdAndUpdate(req.params.id, req.body.patient, function(err, updatedPatient){
        if(err){
            console.log(err);
            res.redirect("back");
        }            
         else{
                req.flash("success", "Account Sucessfully Updated")
                res.redirect('/profile');
            }
    });
});

router.get("/changepass:id", function(req, res){
    res.render("editpass");
});

router.get("/editpass:id", function(req, res){
    res.render("changepassword");
});

router.post("/editpass:id", function(req, res){
    Doctor.findById(req.params.id, function(err, doctor){
        doctor.password = req.body.password;
        doctor.save();
        req.flash("success", "Password successfully Updated");
        res.redirect("/myprofile")

    });
});

router.post("/changepass:id", function(req, res){
    Patient.findById(req.params.id, function(err, patient){
        patient.password = req.body.password;
        patient.save();
        req.flash("success", "Password successfully Updated");
        res.redirect("/profile")

    });
});




router.get("/accountsettings:id", middleware.checkIfDoctor , function(req, res){
    Doctor.findById(req.params.id, function(err, doctor){
        res.render("editdoctor", {doctor: doctor});
    });
});


router.put("/accountsettings:id", middleware.checkIfDoctor, function(req, res){
    Doctor.findByIdAndUpdate(req.params.id, req.body.doctor, function(err, updatedDoctor){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            req.flash("success", "Account successfully Updated !");
            res.redirect("/myprofile");
        }
    });
});

router.get("/doctors", checkIfAdmin ,function(req, res){
        
    Doctor.find({}, function(err, doctors){
       res.render("doctors", {doctors: doctors}) 
    })
});

router.get("/profile", middleware.isLoggedIn ,function(req, res){
   Patient.count({}, function(err, pat){
        if(err){
            console.log(err);
        }else{
            Doctor.count({}, function(err, count){
                if(err){
                    console.log(err);
                }else{
                    Request.count({}, function(err, reqCount){
                        if(err){
                            console.log(err);
                        }else{
                                SignupRequest.count({}, function(err, signupreq){
                                    if(err){
                                        console.log(err);
                                    } else {

                                        res.render("profile" ,{count: count, pat: pat, reqCount: reqCount, signupreq: signupreq }); 
                                    }
                                })
        }        
});
                }        
            });   
             // res.render("profile" ,{count: count}); 
        }        
    });     
 
});

	

router.get("/signup", function(req, res){
    res.render("signup");
})

router.get("/sugarinfo", middleware.isLoggedIn, function(req, res){

            var today = new Date();
            var dd = today.getDate();
            var week = today.getDate()-3;
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 

            today = yyyy+'-'+mm+'-'+dd;
            minimum = yyyy+'-'+mm+'-'+week;

    SugarLevel.find({}, function(err, sugarlevel){

        res.render("sugarinfo", {sugarlevel: sugarlevel, today: today});    
    });
});

router.delete("/deletesugarlevel:id", middleware.isLoggedIn, function(req, res){
    SugarLevel.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong please try again later!!");
            res.redirect("back");
        }
        req.flash("success", "Sucessfully deleted a Sugar Level");
        res.redirect("back");
    });
});

router.get("/sugarstatus:id", middleware.isLoggedIn ,function(req, res){            
    res.render("sugarstatus");
})

router.get("/weeklygraph:id", middleware.isLoggedIn, function(req, res){
    res.render("weeklygraph");
});

router.get("/get_chart_data", function(req, res){
    var SL = [];
      var currentId = req.user._id;
      var foundId;
    SugarLevel.find({}, function(err, sugarl){
         sugarl.forEach(function(sugarlevel){
            if(sugarlevel.author1.id == currentId){
                    foundId = sugarlevel.author1.id;     
                      console.log(foundId);
            }   
                 // res.json(SL);
         })

        // SugarLevel.find({foundId: currentId}, function(err, foundSugarlevel){

        //         res.json(foundSugarlevel);
        // }); 
                    res.json([currentId, sugarl]);
    })
});

router.get("/availablity:id",middleware.isLoggedIn ,function(req,res){

        Available.find({}, function(err, schedule){
            if(err){
                console.log(err)
            }
            else{
                    var _id = req.params.id;
                    Doctor.findById(_id, function(err, doc){
                        if(err){
                            console.log(err);
                        } else{

                            res.render("seedoctors", {schedule: schedule, did: _id, doc: doc});
                        }
                    })

                // res.send(schedule);            
            }
        });
})

router.post("/sugarlevelviapicture:id", upload.single("avatar"), function(req, res){
    var sugarnumber = 0;
    if(req.file){
        okrabyte.decodeFile(req.file.path, function(error, data){
        if(data&&data.length>0){
            res.redirect("/sugarlevel0"+data);
        } else{
            req.flash("error","Value Not Found");
            res.redirect("back");
        }   
            
        });
    }
});

router.post("/changeprofile:id", upload.single('avatar'), function(req, res){    
    if(req.file){
      Patient.findById(req.params.id, function(err, patient){
        //patient.profilepic = req.file;
        // console.log(typeof(req.file.buffer));
        patient.profilepic = req.file.path;
        // console.log(typeof(patient.profilepic.image))

        if(err){
            req.flash("error","Something went wrong please try with correct extension or try later");
            res.redirect("/profile");
        } else{
            patient.save();
            req.flash("success", "Sucessfully updated profile picture");
            res.redirect("/profile");
        }
    });            
} else{
        req.flash("error", "Please Upload Valid File");
        res.redirect("/profile");
    } 

});

router.post("/updateprofile:id", upload.single('avatar'), function(req, res){    
    if(req.file){
      Doctor.findById(req.params.id, function(err, doctor){
        doctor.profilepic = req.file.path;

        if(err){
            req.flash("error","Something went wrong please try with correct extension or try later");
            res.redirect("/myprofile");
        } else{
            doctor.save();
            req.flash("success", "Sucessfully updated profile picture");
            res.redirect("/myprofile");
        }
    });            
} else{
        req.flash("error", "Please Upload Valid File");
        res.redirect("/profile");
    } 

});

router.post("/signuprequest", function(req, res){
    
    var username = req.body.username;
    var name = req.body.name;
    var cnic = req.body.cnic;
    var age = req.body.age;
    var num = req.body.num;
    var bloodgroup = req.body.bloodgroup;
    var gender = req.body.gender;
    var password = req.body.password;
    var address = req.body.address;
    var profilepic = "public\\uploads\\img\\06be91a055c7b1aef5ee881472297401";
    var obj = {username: username, name: name, cnic: cnic, age: age, num: num, gender: gender, bloodgroup: bloodgroup, password: password, address:address, profilepic: profilepic};
    var a;

    Patient.find({}, function(err, patients){
        for(i=0;i<patients.length;i++){
            if(patients[i].username == username){
                a = true;
                break;
            }
        }

        if(a){
            req.flash("error", "User already exist with " + username + " username");
            res.redirect("/signup");
        }
         if(!a){
             SignupRequest.create(obj, function(err, user){
                if(err){
                    console.log(err);
                } else{

                    req.flash("success", "Your data is saved! Your account will be created shortly once approved by Admin ");
                    res.redirect("/login");
                }
            });

        }
    });
   
});

router.get("/signuprequests", checkIfAdmin ,function(req, res){
    SignupRequest.find({}, function(err, foundreq){
        res.render("signupreq", {foundreq: foundreq});
    });
})



router.get("/appointment:id/:pid/:did", function(req, res){
        
        var patientid= req.params.pid;
        var availableid = req.params.id;
        var doctorid = req.params.did;
        Available.findById(req.params.id, function(err, reqq){
            if(err){
                console.log(err);
            } else{
                var d = reqq.date;
                var t1 = reqq.time1;
                var t2 = reqq.time2;
                var patient = {
                    id: req.user.id,
                    username3: req.user.username
                }
                // var obj = {d: d, t1:t1, t2:t2, doctorid:doctorid, patient:patient};

                
                Doctor.findById(doctorid, function(err, doc){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    } else{
                        var doctor = {
                            id: doc.id,
                            username4: doc.username
                        };

                         var obj = {d: d, t1:t1, t2:t2, doctorid:doctorid, patient:patient, doctor: doctor, availableid: availableid};
                            Request.create(obj, function(err, requestt){
                                if(err){
                                    console.log(err);
                                    res.redirect("back");
                                } else{
                                    req.flash("success", "Your Appointment Request have been Sent, We'll Let you know when it's confirmed");
                                    res.redirect("/profile");
                                }
                            });

                    }

                });

                
            }
        });
});

router.delete("/appointment/:id", checkIfAdmin, function(req, res){
   Request.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("back");
      }
      req.flash("success", "Sucessfully deleted a Request");
      res.redirect("back");
   }); 
});

router.delete("/deleteuser:id", checkIfAdmin, function(req, res){
   SignupRequest.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("back");
      }
      req.flash("success", "Sucessfully deleted a Request");
      res.redirect("back");
   }); 
});

router.delete("/removeavailablity/:id", middleware.checkIfDoctor, function(req, res){
    
   Available.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("back");
      }
      req.flash("success", "Sucessfully deleted a Schedule");
      res.redirect("back");
   }); 
});


router.delete("/removeappointment/:id", middleware.checkIfDoctor, function(req, res){
   Appointment.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("back");
      }
      req.flash("success", "Sucessfully cancelled an Appointment");
      res.redirect("back");
   }); 
});


router.get("/myappointments",middleware.checkIfDoctor, function(req, res){
    Appointment.find({}, function(err, appointments){
        res.render("doctorappointments", {appointments: appointments});
    });
});

router.get("/appointments", middleware.isLoggedIn, function(req, res){
    Appointment.find({}, function(err, appointments){
        res.render("patientappointments", {appointments: appointments});
    }); 
});

router.post("/appointment:id/:did/:pid", function(req, res){
    // var aid = req.params.id;

var timearr = [
    '5:00 AM', '5:15 AM', '5:30 AM','5:45 AM', '6:00 AM', '6:15 AM', '6:30 AM', '6:45 AM', '7:00 AM', '7:15 AM', '7:30 AM', '7:45 AM',
    '8:00 AM', '8:15 AM', '8:30 AM', '8:45 AM', '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM','11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
    '2:00 PM', '2:15 PM', '2:30 PM','2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
    '5:00 PM', '5:15 PM', '5:30 PM','5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM', '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM',
    '8:00 PM', '8:15 PM', '8:30 PM','8:45 PM', '9:00 PM', '9:15 PM', '9:30 PM', '9:45 PM', '10:00 PM', '10:15 PM', '10:30 PM', '10:45 PM',
    '11:00 PM', '11:15 PM', '11:30 PM','11:45 PM'
     ]


    Available.findById(req.params.id, function(err, appointment){
                

            if(err){
                console.log(err);
            } else {
                
                var time1 = appointment.time1;
                var appointmenttime1 =time1; 
                var doctorid = req.params.did;
                var patientid = req.params.pid;
                var appointmentdate = appointment.date;


                if(appointment.time1==appointment.time2){          
                req.flash("error", "Schedule Full")
                res.redirect("back");
            } else{
                for(var i =0; i<timearr.length;i++){
                if(time1 == timearr[i]){
                    time1 = timearr[i+1];
                    break;
                }
            }

                appointment.time1 = time1;
                appointment.save();
                var appointmenttime2 = appointment.time1;
                
                Doctor.findById(doctorid, function(err, doc){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                     } else {
                        var doctor2 = {
                        id: doc.id,
                        name1: doc.name
                        }    
                    Patient.findById(patientid, function(err, foundPatient){
                        var patient2 = {
                            id: foundPatient.id,
                            name2: foundPatient.name
                        }
                            var obj = {appointmenttime1: appointmenttime1, appointmenttime2:appointmenttime2, appointmentdate:appointmentdate, doctor2:doctor2, patient2:patient2};
                            Appointment.create(obj, function(err, myappointment){
                                if(err){
                                    console.log(err);
                                } else{
                                    myappointment.save();
                                }
                            });

                    });
                }                   
                                             
            });

                req.flash("success", "Patient Successfully Notified with aloted Time Slot ");
                res.redirect("back");
            }      
        }
            
                // var t1 = appointment.time1;
                // var t2 = appointment.time2;            
           
    })
});

router.get("/myschedule", middleware.checkIfDoctor, function(req, res){
    Available.find({}, function(err, schedule){

        res.render("myschedule", {schedule: schedule});

    });
});
// var sugarnumber = 0;
//var num1;

router.get("/sugarlevel:id", middleware.isLoggedIn, function(req, res){
            
            var sn = req.params.id;
            var numb = sn.match(/\d/g);
            numb = numb.join("");
            numb = Number(numb);
            
            var today = new Date();
            var dd = today.getDate();
            var week = today.getDate()-23;
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 

            today = yyyy+'-'+mm+'-'+dd;
            minimum = yyyy+'-'+mm+'-'+week;
            if(Number(sn)>0){
                num1 = Number(sn);    
            }
            res.render("sugarlevel", {today:today, minimum: minimum, numb:numb});
})



router.get("/sugarstatus", middleware.isLoggedIn, function(req, res){
    res.render("sugarstatus");
})

router.get("/selectdoctor", middleware.isLoggedIn, function(req, res){
   Doctor.find({}, function(err, doctors){
       res.render("selectdoctor", {doctors: doctors})
    })
});

router.get("/doctor:id", middleware.isLoggedIn, function(req, res){
   Doctor.findById(req.params.id, function(err, doctors){
       res.render("doctorinfo", {doctors: doctors})
    })
});


router.get("/patient:id", checkIfAdmin, function(req, res){
   Patient.findById(req.params.id, function(err, patient){
       res.render("patientinfo", {patient: patient})
    })
});

router.get("/req:id", checkIfAdmin, function(req, res){
    SignupRequest.findById(req.params.id, function(err, patient){
        res.render("patientinfo", {patient: patient})
    });
});

router.get("/detail:id", middleware.checkIfDoctor, function(req, res){
   Patient.findById(req.params.id, function(err, patient){
       res.render("patientdetails", {patient: patient})
    })
});

router.get("/makeavailablity",middleware.checkIfDoctor, function(req, res){
            
            var today = new Date();
            var dd = today.getDate()+1;
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 

            var min = today.getDate();
            today = yyyy+'-'+mm+'-'+dd;
            var minimum = yyyy+'-'+mm+'-'+min;


    res.render("available", {today: today, minimum: minimum});
})

router.post("/makeavailablity", middleware.checkIfDoctor, function(req, res){

    
    var date = req.body.date;
    date.toString();
    var time1 = req.body.time1;
    var time2 = req.body.time2;
    if(time1== "Unavailable" || time2 == "Not Available" || date == ""){
        req.flash("error", "All fields are required");
        res.redirect("/myprofile");
    } else{
        var author = {
            id: req.user.id,
            username2: req.user.username
        };

        var obj = {date:date, time1: time1, time2:time2, author:author};

        Available.create(obj, function(err, available){
            if(err){
                console.log(err);
            }
        else{
            res.redirect("/myprofile");
        }
    })
 }

});



router.get("/myprofile", middleware.checkIfDoctor, function(req, res){
        res.render("doctor");
});


// router.post("/sugarlevel:id", middleware.isLoggedIn, function(req, res){

//      var today = new Date();
//             var dd = today.getDate();
//             var week = today.getDate()-3;
//             var mm = today.getMonth()+1; //January is 0!
//             var yyyy = today.getFullYear();

//             if(dd<10){
//                     dd='0'+dd
//                 } 
//                 if(mm<10){
//                     mm='0'+mm
//                 } 

//             today = yyyy+'-'+mm+'-'+dd;
//             minimum = yyyy+'-'+mm+'-'+week;

//              // data coming from form
//             // ==============================
//     var date1 = req.body.date1;
//     date1.toString();
//     if(date1==""){
//         date1 = today;
//     }
//     date1.toString();

//     var sugarLevel = req.body.num;

//      var author = req.body.author;
//     //         // creating object of formData to insert in sugarSchema
//         var obj = {date1:date1, sugarLevel: sugarLevel, author:author};

//             Patient.findById(req.params.id, function(err, patient){
//                 if(err){
//                     console.log(err);
//                 } else{

//                     SugarLevel.create(obj, function(err, sugarl){
//                         if(err){
//                             console.log(err);
//                         } else{
//                             sugarl.author.id = req.user.id;
//                             sugarl.author.username = req.user.username;
//                             patient.sugarlevels.push(sugarl);
//                             sugarl.save();
//                             patient.save();
//                             res.redirect("/profile");
//                         }   

//                     });
//                 }
//             })

// });


router.post("/sugarlevel:id", middleware.isLoggedIn,function(req, res){

            var currentId = req.params.id;

            var today = new Date();
            var dd = today.getDate();
            var week = today.getDate()-3;
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 

            today = yyyy+'-'+mm+'-'+dd;
            minimum = yyyy+'-'+mm+'-'+week;
    

            // data coming from form
    // ==============================
    var date1 = req.body.date1;
    var a;
    date1.toString();
    if(date1==""){
        date1 = today;
    }
    date1.toString();

    SugarLevel.find({}, function(err, sugarlevel){

            var sugarLevel = req.body.num;
            var author1 = {
                id: req.user.id,
                username1: req.user.username
            };
    var obj = {date1:date1, sugarLevel: sugarLevel, author1:author1};
        
        for(i = 0; i<sugarlevel.length; i++){
            if(sugarlevel[i].author1.id==currentId && sugarlevel[i].date1 == date1){
                console.log("yes date found");
                a = true;
                break;
            }
        }
         
         if(a){
            req.flash("error", "You've already entered sugarlevel of " + date1 +" try updating! ");
            res.redirect("back");
        }
        if(!a){

            SugarLevel.create(obj,function(err, sugarl){
                if(err){
                    console.log(err);
                }
                else{
                        res.redirect("/sugarinfo");     
                }
            });
        
        }

    });
});    
    // if(date1==today){
        
    // }

   

   
        // insering object into Sugar model


// router.get("/sugarcheck:id",middleware.isLoggedIn, function(req, res){

//             var currentId = req.params.id;

//             var today = new Date();
//             var dd = today.getDate();
//             var week = today.getDate()-3;
//             var mm = today.getMonth()+1; //January is 0!
//             var yyyy = today.getFullYear();

//             if(dd<10){
//                     dd='0'+dd
//                 } 
//                 if(mm<10){
//                     mm='0'+mm
//                 } 

//             today = yyyy+'-'+mm+'-'+dd;
//             minimum = yyyy+'-'+mm+'-'+week;
//     var count=0;
//     var sugar = 0;
//     SugarLevel.find({}, function(err, sugarlevel){
//         sugarlevel.forEach(function(sl){
//             if(sl.author1.id == req.params.id){
//                 if(sl.date1 == today){
//                     count++;
//                     sugar += sl.sugarLevel;                     
//                 }
//             } 
//         });
//         // console.log(count);
//         console.log(sugar/count);
//         res.redirect("/sugarinfo")
//     });
// });

    


// router.post("/signup", function(req, res) {

//     Patient.register(new Patient({username: req.body.username, name : req.body.name, gender: req.body.gender, address: req.body.address, bloodgroup:req.body.bloodgroup, cnic: req.body.cnic, num: req.body.num, age: req.body.age}), 
//     	req.body.password, function(err, patient){
//         if(err){
//            req.flash("error", err.messge);
//             res.send(err);
//         }
//         passport.authenticate("local")(req, res, function(){    
//             req.flash("success", "Welcome to Sugpat "+ req.body.name);  
//             res.redirect("/profile");
//         });
        
//     });
// });    


// router.post("/signup", function(req, res) {

//     var username = req.body.username;
//     var name = req.body.name;
//     var gender = req.body.gender;
//     var address = req.body.address;
//     var password = req.body.password;

//     var newUser = new Patient({
//         name: name,
//         username: username,
//         password: password,
//         gender: gender
//     });

//     Patient.createUser(newUser, function(err, user){
//         if(err) throw err;
//         console.log(user);
//     });
//     res.redirect("/login");
// });


//   Patient.auth({username: req.body.username}, req.body.password, function (err, user) {
//   if (err) {
//     // There has been an error
//     res.send("error")
//     // return;
//   }
  
//   if (!user) {
//     // User was not found
//     res.redirect("/signup")
//   }

//   // User is authenticated
// // });  

//     res.redirect("/profile");

//     });



//     Patient.auth({username: req.body.username}, req.body.password, function (err, user) {
//   if (err) {
//     // There has been an error
//     return;
//   }
  
//   if (!user) {
//     // User was not found
//     return;
//   }

//   if (user.isLocked) {
//     // Account is locked
//     var lockedUntil = user.lockUntil; // ms
//     res.redirect("/profile");
//     return;
//   }

//   // User is authenticated
// });    

router.post('/register', checkIfAdmin ,(req,res) => {
      var doctor = new Doctor();
      doctor.username = req.body.username;
      doctor.password = req.body.password;
      doctor.cnic = req.body.cnic;
      doctor.num = req.body.num;
      doctor.name = req.body.name;
      doctor.age = req.body.age;
      doctor.qualification = req.body.qualification;
      doctor.specialization = req.body.specialization;
      doctor.description = req.body.description;
      doctor.gender = req.body.gender;
      doctor.profilepic = "public\\uploads\\img\\06be91a055c7b1aef5ee881472297401";
      var a;

      Doctor.find({}, function(err, doctors){
        for(i=0; i<doctors.length; i++){
            if(doctors[i].username == doctor.username){
                a = true;
                break;
            }
        }

        if(a){
            req.flash("error", "Doctor with "+ doctor.username +" already exist");
            res.redirect("back");
        }
        if(!a){
            doctor.save((err,user) => {
                if(err){console.error("Error: ", err)}
                else{
                  req.flash("success", "Doctor Sucessfully Added");
                  res.redirect('/profile');
                }
            })
        }
      });
});


router.post('/signup:id',(req,res) => {

    SignupRequest.findById(req.params.id, function(err, foundPatient){
      var patient = new Patient();
      patient.username = foundPatient.username;
      patient.password = foundPatient.password;
      patient.age = foundPatient.age;
      patient.num = foundPatient.num;
      patient.bloodgroup = foundPatient.bloodgroup;
      patient.address = foundPatient.address;
      patient.cnic = foundPatient.cnic;
      patient.gender = foundPatient.gender;
      patient.name = foundPatient.name;
      patient.profilepic = foundPatient.profilepic;
      var a;

      Patient.find({}, function(err, patients){
        
        for(i = 0; i<patients.length; i++){
             if(patients[i].username == patient.username){
                a = true;
                break;
             } 
        }
              if(a){
                req.flash("error", "User already exists with this Username");
                res.redirect("back");
              }
                   if(!a){
                      patient.save((err,user) => {
                      if(err){console.error("Error: ", err)}
                      else{
                        req.flash("success", "Patient Sucessfully Created")
                        res.redirect('back');
                      }
                    })         
                  
                }

      });

 

    })

})

// router.post("/register",checkIfAdmin, function(req, res){
//     Doctor.register(new Doctor({username: req.body.username, name: req.body.name, cnic: req.body.cnic, num: req.body.num, age: req.body.age, qualification: req.body.qualification, specialization: req.body.specialization, description: req.body. description, gender: req.body.gender}),
//         req.body.password, function(err, doctor){
//             if(err){
//                 res.send(err)
//             }
//             //req.logout();
//             // passport.authenticate("local")(req, res, function(){
//                 req.flash("success", "Doctor Sucessfully Added");
//                 res.redirect("/profile");
//             // });
//             // req.flash("success", "Doctor Sucessfully Added");
//             // res.redirect("/profile");
//         });
// });

    // var username = req.body.username;
    // var name = req.body.name;
    // // var gender = req.body.gender;
    // // var address = req.body.address;
    // var password = req.body.password;

    // var newUser = new Doctor({
    //     name: name,
    //     username: username,
    //     password: password
    //     // gender: gender
    // });

    // Doctor.createUser(newUser, function(err, user){
    //     if(err) throw err;
    //     console.log(user);
    // });
    // res.redirect("/profile");


        // -------------------------------------------------------
        // -------------------------------------------------------


// passport.use(new localStrategy(function(username, password, done){
//     Patient.getPatientByUsername(username, function(err, user){
//                        if(err){
//                          res.send(err);
//                          // console.log(password);
//                        }
//         if(!user){
//             console.log("User Not Found 1")


//             Doctor.getPatientByUsername(username, function(err, user){
//                 if(err) {
//                     console.log("issue here")
//                 }
//                 if(!user){
//                     console.log("User does not exist");
//                 }
//                 console.log("May be a Doctor");
//                 Doctor.comparePass(password, user.password, function(err, isMatch){
//                     if(err){
//                     res.send(err);
//                     console.log(password);
//                 }
//                     if(isMatch){
//                         return done(null, user);
//                     } else{
//                         return done(null, false);
//                     }
//                 });
//             });

//         }
//         console.log("reached here");
//         Patient.comparePassword(password, user.password, function(err, isMatch){
//             if(err) throw err;
//             if(isMatch){
//                 return done(null, user);
//             } else{
//                 return done(null, false);
//             }
//         });
//     });
// }));

// passport.serializeUser(function(user, done){
//     done(null, user.id);
// });

// passport.deserializeUser(function(id, done){
//     Patient.getPatientById(id, function(err, user){
//         done(err, user);
//         console.log("done this part");
//     });
// })

// passport.deserializeUser(function(id, done){
//     Doctor.getPatientById(id, function(err, user){
//         done(err, user);
//     });
// })



         //-----------------------------------------
        //------------------------------------------




        // ===========================================
        // ===========================================


passport.use('patient',new localStrategy(function(username, password, done){
    Patient.findOne({username:username},function(err,user){
        if(err) return done(err);
        if(!user){
            return done(null,false);
        }
        if(!user.comparePassword(password)){
            return done(null,false);
        }
        return done(null,user);
    });
}));

passport.use('doctor',new localStrategy(function(username, password, done){
    Doctor.findOne({username:username},function(err,user){
        if(err) return done(err);
        if(!user){
            return done(null,false);
        }
        if(!user.comparePassword(password)){
            return done(null,false);
        }
        return done(null,user);
    });
}));




//passport Serialization
passport.serializeUser(function(user,done){
    done(null,user._id);
});

//passport Deserialize
passport.deserializeUser(function(id,done){

    Patient.findById(id,function(err,user){

        if(err) return done(err);
        
        if(user){
            done(null,user);
        }
        
        else{
            Doctor.findById(id,function(err,user){
            
                if(err) return done(err);
                
                if(user){
                    done(null,user);
                }
                
                else{
                    console.log("User Not Found");    
                    res.redirect("/login");
                }
            })
        }
    })
    
});



// router.get("/role", function(req, res){
//     var username = req.body.username;
//     var password = req.body.password;
//     var role;
//     var profile;
//     var choice = req.body.choice;
//     if(choice == "/login"){
//         role = "patient";
//         profile = "/profile";
//     } else{
//         role = "doctor";
//         profile = "/myprofile";
//     }

//     // router.post(choice ,passport.authenticate(role ,{failureRedirect:'/login'}),(req,res) => {
//     //   res.redirect(profile);
//     // })
// });


router.post('/login',passport.authenticate('patient',{failureRedirect:'/login'}),(req,res) => {
      res.redirect('/profile');
})

router.post('/doctorLogin', passport.authenticate('doctor',{failureRedirect:'/doctorlogin'}),(req,res) => {
      res.redirect('/myprofile');
  })

// router.post("/login",passport.authenticate("local", {

//     successRedirect: "/profile",
//     failureRedirect: "/login"
// }) ,function(req, res) {
//     console.log(req.user.name);
// });





// router.post("/login", Patient.auth({ username: username }, password, function (err, user) {
//     if (err) {
//         // There has been an error 
//         return;
//     }
    
//     if (!user) {
//         // User was not found 
//         return;
//     }
 
//     if (user.isLocked) {
//         // Account is locked 
//         var lockedUntil = user.lockUntil; // ms 
//         return;
//     }
 
//     // User is authenticated 
//     res.redirect("/profile");
// }),
// function(req,res){

// }
// // );
// });



// logout User

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Sucessfully logged you out !!!");
    res.redirect("/");
    
});



function checkIfAdmin(req, res, next){

    if(req.isAuthenticated()){
        var obj = {
            a:'59a434543e3849127897860f'
        };
        if(req.user._id.equals(obj.a)){
            // res.redirect("/");
            
             next();
        }
        else{
            req.flash("error", "Your You do not have permission to Access the route !!!");
            res.redirect("back");
        }
    }
    else{
            req.flash("error", "Your You do not have permission to Access the route !!!");
        res.redirect("back");
    }
}


module.exports = router;