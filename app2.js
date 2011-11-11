var tame = require('tamejs').runtime;
var __tame_defer_cb = null;
var __tame_fn_0 = function (__tame_k) {
        tame.setActiveCb(__tame_defer_cb);
        var express = require('express'),
            routes = require('./routes'),
            User = require('./dbhandlers').UserProvider,
            Match = require('./dbhandlers').MatchProvider;
        require('tamejs');

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
            var er, users;
            user.findAll(
            __tame_defers.defer({
                assign_fn: function () {
                    er = arguments[0];
                    users = arguments[1];
                },
                parent_cb: __tame_defer_cb,
                line: 40,
                file: "app.js"
            }));
            console.log(users);




            res.send(users);
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
                res.send("Awesomesauce");
            });
        });


        app.listen(process.env.PORT || 3000);
        console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
        tame.callChain([__tame_k]);
        tame.setActiveCb(null);
    };
__tame_fn_0(tame.end);