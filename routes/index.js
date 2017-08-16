var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Doctor = require("../models/doctor");
var Patient = require("../models/patient");
var middleware = require("../middleware");
var SugarLevel = require("../models/sugarlevel");


router.get("/",function(req, res){
   
   res.redirect("login"); 
});

router.get("/removeall", function(req, res){
    Patient.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed all the patients from database")
        })
    res.send("removed all the patients from database");
})

router.get("/removeallsugar", function(req, res){
	SugarLevel.remove({}, function(err){
			if(err){
				console.log(err);
			}
			console.log("removed all the sugarlevels from database")
		})
	res.send("removed all the sugarlevels from database");
})


router.get("/login",function(req, res){
   res.render("login"); 
});

router.get("/register", checkIfAdmin ,function(req, res){
   res.render("register"); 
});

router.get("/patients", checkIfAdmin ,function(req, res){

    Patient.find({}, function(err, patients){
       res.render("patients", {patients: patients}); 
    })
});

router.get("/doctors", checkIfAdmin ,function(req, res){
    Doctor.find({}, function(err, doctors){
       res.render("doctors", {doctors: doctors}); 
    })
});

router.get("/profile", middleware.isLoggedIn, function(req, res){
   res.render("profile"); 
});

	

router.get("/signup", function(req, res){
    res.render("signup");
})

router.get("/sugarinfo", middleware.isLoggedIn, function(req, res){
    SugarLevel.find({}, function(err, sugarlevel){
        res.render("sugarinfo", {sugarlevel: sugarlevel});    
    });
})

router.get("/sugarlevel", middleware.isLoggedIn, function(req, res){
    res.render("sugarlevel");
})



router.get("/sugarstatus", middleware.isLoggedIn, function(req, res){
    res.render("sugarstatus");
})

router.get("/selectdoctor", middleware.isLoggedIn, function(req, res){
    res.render("selectdoctor");
})




router.post("/sugarlevel", middleware.isLoggedIn,function(req, res){
    
            // data coming from form
    // ==============================
    var date1 = req.body.date1;
    date1.toString();
    var sugarLevel = req.body.num;

     var user = {
        id: req.user.id,
        username: req.user.username
    };

    // ==============================
    
        // creating object of formData to insert in sugarSchema
    var obj = {date1:date1, sugarLevel: sugarLevel, user:user};
   
        // insering object into Sugar model
    SugarLevel.create(obj,function(err, sugarl){
        if(err){
            console.log(err);
        }
        else{
            // req.flash("success", "campground successfully created !!!");
            sugarl.save();
            res.redirect("/sugarinfo");        
        }
    });
});


    


router.post("/signup", function(req, res) {

    Patient.register(new Patient({username: req.body.username, name : req.body.name, gender: req.body.gender, address: req.body.address, bloodgroup:req.body.bloodgroup, cnic: req.body.cnic, num: req.body.num, age: req.body.age}), 
    	req.body.password, function(err, patient){
        if(err){
           // req.flash("error", err.messge);
            res.send(err);
        }
        passport.authenticate("local")(req, res, function(){    
            req.flash("success", "Welcome to Sugpat "+ req.body.name);  
            res.redirect("/profile");
        });
        
    });
});    



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



router.post("/register", checkIfAdmin, function(req, res){
    Doctor.register(new Doctor({username: req.body.username, name: req.body.name, cnic: req.body.cnic, num: req.body.num, age: req.body.age, qualification: req.body.qualification, specialization: req.body.specialization, description: req.body. description, gender: req.body.gender}),
        req.body.password, function(err, doctor){
            if(err){
                res.send(err)
            }
            //req.logout();
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Doctor Sucessfully Added");
                res.redirect("/profile");
            });
            // req.flash("success", "Doctor Sucessfully Added");
            // res.redirect("/profile");
        });
});


router.post("/login",passport.authenticate("local", {

    successRedirect: "/profile",
    failureRedirect: "/login"
}) ,function(req, res) {
    console.log(req.user.name);
});


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
    res.redirect("/login");
    
});



function checkIfAdmin(req, res, next){

    if(req.isAuthenticated()){
        var obj = {
            a:'59942ea4e179ce1a3843c1ff'
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