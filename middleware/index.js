// all the middleware goes here

var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found!");
				res.redirect("back");
			} else {
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}
				else {
					req.flash("error", "You don't have persmission to do that!");
					res.redirect("back");
				}
			}
		});	
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err || !foundCampground){
				req.flash("error", "Campground nof found!");
				res.redirect("back");
			} else {
				// does user own the campgroun?
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}
				else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});	
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

module.exports = middlewareObj;