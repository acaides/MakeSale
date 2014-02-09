var memcache = (function () {
        var mc = require('memcache');

        return new mc.Client();
    }) (),
    db = require('../db'),
    _ = require('lodash');

memcache.connect();

memcache.on('close', function () {
    memcache.connect();
});

memcache.on('timeout', function () {
    memcache.connect();
});

memcache.on('error', function (e) {
    console.log(e);
});

module.exports = function MSAuth (req, res, next) {
    var authToken = req.headers['ms-auth-token'];

    if(authToken) {
        memcache.get('MS_AUTH:' + authToken, function (err, auth) {
            if(!err && _.isString(auth)) {
                req.MSAuth = JSON.parse(auth);
                next();
            } else {
                db.selectAuthentication(authToken, function (err, auth) {
                    if(!err && !!auth) {
                        db.selectUserPermissions(auth.userId, function (err, userPermissions) {
                            if(!err) {
                                auth.userPermissions = userPermissions;
                                memcache.set('MS_AUTH:' + authToken, JSON.stringify(auth));
                                req.MSAuth = auth;
                            }

                            next();
                        });
                    } else {
                        next();
                    }
                });
            }
        });
    } else {
        next();
    }
};