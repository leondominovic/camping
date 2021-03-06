var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	avatar:  {
		type: String,
		default: "../public/images/avatar-inside-a-circle.png"
	},
	firstName: String,
	lastName: String,
	email: String,
	isAdmin: {
		type: Boolean,
		default: false
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);