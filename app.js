/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    User = require('./dbhandlers').UserProvider,
    Match = require('./dbhandlers').MatchProvider;

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
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

// Routes
app.get('/', function (req, res) {
		var user = new User();
		var users = 
		user.findAll(function(err, inU) {
				users = inU;
			}
		);
    res.render('home', {
        layout: false,
        locals: {
        	users: users
    })
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
    user.save({
        name: req.body.name,
        username: req.body.user,
        password: req.body.pass,
        email: req.body.email
    }, function () {
        res.send(JSON.stringify({
            err: 0
        }))
    });
});


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);