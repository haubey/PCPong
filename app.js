var express = require('express'),
		async = require('async'),
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
    user.findAll(function (err, users) {
        match.findAll(function (er, matches) {
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
    var isFilled = true;
    if (req.body.name == "" || req.body.user == "" || req.body.pass == "") {
        isFilled = false;
    }
    var user = new User();
    if (req.body.masspass == "bedspread" && isFilled) {
        user.save({
            name: req.body.name,
            username: req.body.user,
            password: req.body.pass,
            email: req.body.email
        }, function (err) {
            if (err) {
                res.json({
                    "error": 1,
                    "message": "Something went wrong"
                }, 500);
            } else {
                res.json({
                    "error": 0,
                    "message": "User created"
                }, 200);
            }
        });
    } else {
        res.json({
            "error": 1,
            "message": "Oops, looks like your form isn't completely filled out!"
        }, 403);
    }
});

app.get('/u/:un', function (req, res) {
    var user = new User();
    user.findUser({
        username: req.params.un
    }, function (er, user) {
        res.send("Nothing to see here (yet)");
    });

});

app.post('/m', function (req, res) {
    //have to figure out way of getting all users and stuff without callbacks
    //but until then...
    var user = new User();
    
    async.series([

    function (cb) {
    		var u;
        user.findUser({
            "username": req.body.wuname
        }, function (err, usr) {
            if (err) {
                res.json({
                    "error": 1,
                    "message": "Internal server error"
                }, 500);
                return;
            }
            if (usr) {
            	//	console.log("WINNING USER " + usr);
                if (usr.password == req.body.wpass) {
                    u = usr;
                } else {
                    res.json({
                        "error": 1,
                        "message": "Winning user password not correct!"
                    }, 403);
                    return;
                }
            } else {
            		console.log(usr);
                res.json({
                    "error": 1,
                    "message": "Winning user not found!"
                }, 404);
                return;
            }
          cb(null, usr.name);
        });
    }, 
    function (cb) {
    		var usr;
        user.findUser({
            "username": req.body.luname
        }, function (err, u) {
            if (err) {
                res.json({
                    "error": 1,
                    "message": "Internal server error"
                }, 500);
                return;
            }
            if (u) {
            		console.log("LOOSING USER " + u);
                if (u.password == req.body.lpass) {
                		usr = u;
                } else {
                    res.json({
                        "error": 1,
                        "message": "Losing user password not correct!"
                    }, 403);
                }
            } else {
                res.json({
                    "error": 1,
                    "message": "Winning user not found!"
                }, 404);
                return;
            }
          cb(null, u.name);
        });

    }
    ],

    function (err, results) {
    		console.log(results);
        user.update({
            username: req.body.wuser
        }, true, function (u) {});
        user.update({
            username: req.body.luser
        }, false, function (u) {});
        var match = new Match();
        match.save({
            winName: results[0],
            loseName: results[1]
        }, function () {
            res.json({
                "error": 0,
                "message": "Match made"
            }, 200);
        });
    }
    );
    /* user.findUser({
        username: req.body.wuser
    }, function (e, u) {
    		console.log(e);
    		console.log(u);
        if (e) {
            res.json({
                "error": 1,
                "message": "Wining user not found!"
            }, 404);
            return;
        } else {
            user.update({
                username: req.body.wuser
            }, true, function (u) {});
            user.findUser({
                username: req.body.luser
            }, function (le, lu) {
                if (le) {
                    res.json({
                        "error": 1,
                        "message": "Losing user not found!"
                    }, 404);
                } else {
                    user.update({
                        username: req.body.luser
                    }, false, function (u) {});
                    var match = new Match();
                    match.save({
                        winName: u.name,
                        loseName: lu.name
                    }, function () {
                        res.json({
                            "error": 0,
                            "message": "Match made"
                        }, 200);
                    });
                };
            })
        }
    }) */
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);