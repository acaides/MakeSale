var db = require('../../../db'),
    _ = require('lodash'),
    crypto = require('crypto');

module.exports = {

    create: function createAuthentication (req, res) {
//        var errors = [],
//            authentication;
//
//        if(_.isPlainObject(req.body)) {
//            var email = req.body.email,
//                password = req.body.password,
//                name = req.body.name;
//
//            if(!email) {
//                errors.push('"email" is a required parameter.');
//            }
//
//            if(!password) {
//                errors.push('"password" is a required parameter.');
//            }
//
//            if(!name) {
//                errors.push('"name" is a required parameter.');
//            }
//        } else {
//            errors.push('Invalid request body.');
//        }
//
//        if(errors.length > 0) {
//            res.send(400, {
//                errors: errors
//            });
//        } else {
//            db.selectUsersByEmail(email, function (err, user) {
//                if(err) {
//                    res.send(400, { error: 'No such user.' });
//                }
//
//                var auth = {
//                    userId: 1,
//                    token: crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex'),
//                    name: name
//                };
//
//                db.insertAuthentication(auth, function (err) {
//                    if(!err) {
//                        res.send(200, auth);
//                    } else {
//                        res.send(500);
//                    }
//                });
//            });
//        }

        res.send(501);
    },

    destroy: function destroyAuthentication (req, res) {
        res.send(501);
    },

    list: function listUnits (req, res) {
        res.send(501);
    },

    retrieve: function retrieveUnit (req, res) {
        res.send(501);
    }
};