var mongoose = require('mongoose');
mongoose.connect(process.env.databaseURL);
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

//setting up schemas...
var User = new Schema({
	username: {type: String, validate: [validate, 'Please enter a Username greater than 8 characters'], index: {unique: true }},
	password: {type: String, validate: [validate, 'Plase enter a Password greater than 8 characters']},
	wins: {type: Number, default: 0},
	losses: {type: Number, default: 0},
	ranking: {type: Number, default: 1000, index: -1},
	firstName: String,
	lastName: String,
	uid: ObjectId
});

var Match = new Schema({
	winner: String,
	loser: String
	date: {type Date: default: Date.now}
});

//setting up mongoose stuff
User = mongoose.model('User', User);
Match = mongoose.model('Match', Match);


//UserProvidor to abstract back in app.js
UserProvider = function(){};

UserProvider.prototype.findAll = function(callback) {
	User.find({}, function(err, users) {
		//users is [user, user2...]
		callback(null, users)
	});
};

UserProvider.prototype.findById = function(id, callback) {
	User.findById(id, function(err, user) {
		//user is a {user}
		callback(null, user);
	});
};

UserProvider.prototype.update = function(id, wins, losses, callback) {
	User.findById(id, function(err, user) {
		if(!err) {
			user.wins = wins;
			user.losses = losses;
			user.save(function (err) {
				callback();
			});
		} else {
			callback({error: 105, msg: "User does not exist"});
	});
};

UserProvider.prototype.save = function(params, callback) {
	var user = new User({
		firstName: params.firstName,
		lastName: params.lastName,
		username: params.username,
		password: params.password
	});
	user.save(function(err) {
		callback();
	});
}

//Math Provider now
MatchProvider = function(){};
MatchProvider.prototype.findAll = function(callback) {
	Match.find({}, function (err, matches) {
		callback(null, matches);
	});
}

MatchProvider.prototype.save = function(params, callback) {
	var match = new Match({
		winner: params.winName,
		loser: params.loseName,
	});
	match.save(function(err) {
		callback();
	});
}

//Just some validate functions for the databases.
function validate(value) {
	return value && value.length >= 8;
}
function validateEmail(value) {
	var emailRegex = new RegExp(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
  return emailRegex.test(value);
}

exports.UserProvider = UserProvider;
exports.MatchProvider = MatchProvider;