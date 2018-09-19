// ===================
// AUTH ROUTES
// ===================
var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");
var Campground = require("../models/campground");

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
	res.render("register",{page: "register"});
});

router.post("/register", function(req, res){
	var password = req.body.user.password;
	var newUser = req.body.user;
	delete newUser.password;
	if(req.body.user.adminCode === "tajnaveza"){
		newUser.isAdmin = true;
	}
	User.register(newUser, password, function(err, user){
		if(err){
			return res.render("register",{error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// shoe login form
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
});

// handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}),function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

// USERS PROFILE

router.get("/user/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err || !foundUser){
			req.flash("eror", "Something went wrong!");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    });
	});
});

module.exports = router;