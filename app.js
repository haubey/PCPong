var express = require('express'),
    routes = require('./routes'),
    User = require('./dbhandlers').UserProvider,
    Match = require('./dbhandlers').MatchProvider;

var app = module.exports = express.createServer();


app.configure(
	function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({
        src: __dirname + '/public'
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


app.get('/', function (req, res) {
  var user = new User();
  var match = new Match();
 	user.findAll(function(err, users) {
 		match.findAll(function(er, matches) {
  		res.render('home', {
    		layout: false,
      	users: users,
    		matches: matches
   		});
		});
	});
});


app.get('/about', function (req, res) {
    res.render('about', {
        layout: false
    });
});

app.get('/u/new', function (req, res) {
    res.render('newuser', {
        layout: false
    });
});

app.post('/u/new', function (req, res) {
    console.log(req.body.pass);
    var user = new User();
    if(req.body.masspass == "bedspread") {
    user.save({
        name: req.body.name,
        username: req.body.user,
        password: req.body.pass,
        email: req.body.email
    }, function () {
        res.send("Awesomesauce");
    });
    }
});

app.get('/u/:un', function(req, res) {
	var user = new User();
	user.findUser({username: req.params.un}, function(er, user) {
		res.send(JSON.stringify(user));
	});

});

app.post('/m', function (req, res) {
	//have to figure out way of getting all users and stuff without callbacks
	//but until then...
	var user = new User();
	user.findUser({username: req.body.wuser}, function(e, u) {
		if(e) {//implement error handling with 401s and stuff....
		}
		else {
			user.update({username: req.body.wuser}, true, function(u) {});
			user.findUser({username: req.body.luser}, function(le, lu) {
				if(e) {//implement error handling with 401s and stuff....
				}
				else {
					user.update({username: req.body.luser}, false, function(u) {});
					var match = new Match();
					match.save({
						winUser: u.name,
						loseName: lu.name
					}, function() {
						res.send("Awesomesauce");
					});
				}
			})
		}
	});
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);