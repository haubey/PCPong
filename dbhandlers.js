var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//setting up schemas...
var User = new Schema({
    username: {
        type: String,
        validate: [validate, 'Please enter a Username'],
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        validate: [validate, 'Plase enter a Password']
    },
    wins: {
    type: Number,
    default:
        0
    },
    email: {
        type: String,
        validate: [validateEmail, 'Please enter a valid email.']
    },
    losses: {
        type: Number,
    default:
        0
    },
    points: {
        type: Number,
    default:
        0,
        index: -1
    },
    name: String,
    uid: ObjectId
});

var Match = new Schema({
    winner: String,
    loser: String,
    date: {
        type: String,
    		default: Date.now,
        index: -1
    }
});

//setting up mongoose stuff
User = mongoose.model('User', User);
Match = mongoose.model('Match', Match);


//UserProvidor to abstract back in app.js
UserProvider = function () {};

UserProvider.prototype.findAll = function (callback) {
		var query = User.find({});
		query.sort("points", -1);
		query.exec(function(err, users) {
			callback(err, users);
		});
};

UserProvider.prototype.findUser = function (params, callback) {
    User.findOne(params, function (err, user) {
  			if(err)
  				callback(err, null)
  			else 
       	 callback(null, user);
    });
}

UserProvider.prototype.findById = function (id, callback) {
    User.findById(id, function (err, user) {
        //user is a {user}
        if(err)
        	callback(err, null);
        else
        	callback(null, user);
    });
};

UserProvider.prototype.update = function (params, win, callback) {
    User.findOne(params, function (err, user) {
        console.log(user);
        if (!err) {
            if (win) {
                user.wins++;
                user.points += 2;
            } else {
                user.losses++
            }
            user.save(function (err) {
                callback();
            });
        }
    });
};

UserProvider.prototype.save = function (params, callback) {
    console.log(params.password);
    console.log(params.username);
    var user = new User({
        name: params.name,
        username: params.username,
        password: params.password,
        email: params.email
    });
    user.save(function (err) {
        if (err) console.log(err);
        callback();
    });
}

//Math Provider now
MatchProvider = function () {};
MatchProvider.prototype.findAll = function (callback) {
		var query = Match.find({});
		query.sort("date", -1);
    query.exec(function (err, matches) {
    		//console.log(matches[0].date);
        callback(null, matches);
    });
}

MatchProvider.prototype.save = function (params, callback) {
		var d = new Date();
		//var m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		var match = new Match({
        winner: params.winName,
        loser: params.loseName,
        date: d
    });
    match.save(function (err) {
        callback();
    });
}

//Just some validate functions for the databases.


function validate(value) {
    return value && value.length;
}

function validateEmail(value) {
    var emailRegex = new RegExp(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    return emailRegex.test(value);
}

exports.UserProvider = UserProvider;
exports.MatchProvider = MatchProvider;