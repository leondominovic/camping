var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campground
router.get("/", function(req, res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err,allCampgrounds){
			if(err) {
				req.flash("error", "Wrong input search!");
				res.render("campgrounds", {campgrounds: allCampgrounds});
			} 
			else if(allCampgrounds.length < 1){
				req.flash("error", "Campground not found!");
				res.render("campgrounds", {campgrounds: allCampgrounds});
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
			}
	});
	} else {
			Campground.find({}, function(err,allCampgrounds){
			if(err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
			}
	});
	}
	
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground,function(err, newlyCreated){
		if (err) {
			console.log(err);
		} else {
			res.locals.isThatUser = true;
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", middleware.isLoggedIn,function (req, res){
	res.render("campgrounds/new");
});

// SHOW - shows more infor about one campground
router.get ("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(!err && foundCampground){
			res.render("campgrounds/show", {campground: foundCampground});
		} else {
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit",  {campground: foundCampground });
	});	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		res.redirect("/campgrounds");
	});
});

// DESTROY CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			res.redirect("/" + req.params.id);
		} else {
			res.redirect("/");
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;