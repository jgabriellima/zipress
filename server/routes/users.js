'use strict';

// User routes use users controller
var users = require('../controllers/users');


module.exports = function(app, passport) {


    app.route('/removefile').get(function(req, res) {
        //try remove file
        try {
            var fs = require('fs');
            var tempFile = fs.openSync(req.query.fileName, 'r');
            fs.closeSync(tempFile);
            fs.unlinkSync(fileName);
        } catch (e) {
            console.log(e);
        }
        req.send();
    });
    // 
    app.route('/zipress')
        .get(function(req, res) {
            var url = req.query.url;
            var name = url.split('/');
            var fileName = name[name.length - 1];
            //
            var http = require('http');
            var fs = require('fs');
            var zlib = require('zlib');
            //

            console.log(fileName);
            // 
            http.get(url, function(response) {
                if (response.statusCode !== 200) {
                    if (response) {
                        console.log(response.statusCode + ' ERROR getting ' + url);
                        res.jsonp({
                            'status': 'error'
                        });
                    }
                }
                var fd = fs.openSync(fileName, 'w');
                response.on("data", function(chunk) {
                    fs.write(fd, chunk, 0, chunk.length, null, function(err, written, buffer) {
                        if (err) {
                            console.log(err);
                            res.jsonp({
                                'status': 'error'
                            });
                        }
                    });
                });

                response.on("end", function() {
                    try {
                        fs.closeSync(fd);
                    } catch (e) {

                    }
                    // process.exit(0);
                    var gzip = zlib.createGzip();
                    var fs = require('fs');
                    var inp = fs.createReadStream(fileName);
                    var zipname = Date.now() + '.gz';
                    var result = './public/system/assets/zips/' + zipname;
                    var out = fs.createWriteStream(result);
                    console.log("zipando...");
                    inp.pipe(gzip).pipe(out);
                    console.log("ZIP completo");
                    //try remove file
                    try {
                        var fs = require('fs');
                        var tempFile = fs.openSync(fileName, 'r');
                        fs.closeSync(tempFile);
                        fs.unlinkSync(fileName);
                    } catch (e) {
                        console.log(e);
                    }

                    res.jsonp({
                        'status': 'ok',
                        'url': req.headers.host + '/public/system/assets/zips/' + zipname
                    });

                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
                process.exit(1);
            });
        });


    app.route('/logout')
        .get(users.signout);

    app.route('/users/me')
        .get(users.me);

    // Setting up the users api
    app.route('/register')
        .post(users.create);

    // Setting up the userId param
    app.param('userId', users.user);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function(req, res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });

    // Setting the local strategy route
    app.route('/login')
        .post(passport.authenticate('local', {
            failureFlash: true
        }), function(req, res) {
            res.send({
                user: req.user,
                redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
            });
        });

    // Setting the facebook oauth routes
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '#!/login'
        }), users.signin);

    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the github oauth routes
    app.route('/auth/github')
        .get(passport.authenticate('github', {
            failureRedirect: '#!/login'
        }), users.signin);

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the twitter oauth routes
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter', {
            failureRedirect: '#!/login'
        }), users.signin);

    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the google oauth routes
    app.route('/auth/google')
        .get(passport.authenticate('google', {
            failureRedirect: '#!/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);

    app.route('/auth/google/callback')
        .get(passport.authenticate('google', {
            failureRedirect: '#!/login'
        }), users.authCallback);

    // Setting the linkedin oauth routes
    app.route('/auth/linkedin')
        .get(passport.authenticate('linkedin', {
            failureRedirect: '#!/login',
            scope: ['r_emailaddress']
        }), users.signin);

    app.route('/auth/linkedin/callback')
        .get(passport.authenticate('linkedin', {
            failureRedirect: '#!/login'
        }), users.authCallback);

};
