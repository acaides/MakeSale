var db = require('../../../db'),
    _ = require('lodash'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto');

module.exports = {

    create: function createAuthentication (req, res) {
        var errors = [],
            authentication;

        if(_.isPlainObject(req.body)) {
            var email = req.body.email,
                password = req.body.password,
                name = req.body.name;

            if(!email) {
                errors.push('"email" is a required parameter.');
            }

            if(!password) {
                errors.push('"password" is a required parameter.');
            }

            if(!name) {
                errors.push('"name" is a required parameter.');
            }
        } else {
            errors.push('Invalid request body.');
        }

        if(errors.length > 0) {
            res.send(400, {
                errors: errors
            });
        } else {
            db.selectUserByEmail(email, function (err, user) {
                if(err || !user) {
                    res.send(400, { error: 'No such user.' });
                    return;
                }

                bcrypt.compare(password, user.password, function(err, matches) {
                    if(err) {
                        res.send(500, { error: 'Server failed to process authentication.' });
                    } else {
                        if(matches) {
                            var auth = {
                                userId: user.id,
                                token: crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex'),
                                name: name
                            };

                            db.insertAuthentication(auth, function (err, result) {
                                if(!err) {
                                    res.send(200, _.extend(auth, result));
                                } else if(err.code === 'ER_DUP_ENTRY') {
                                    res.send(400, { error: 'The user already has an authentication with the specified name.' });
                                } else {
                                    res.send(500, { error: 'Server failed to create authentication.' });
                                }
                            });
                        } else {
                            res.send(401, { error: 'Bad password.' });
                        }
                    }
                });
            });
        }
    },

    destroy: function destroyAuthentication (req, res) {
        var authId = parseInt(req.param('authenticationId'), 10),
            MSAuth = req.MSAuth;

        if(!!MSAuth) {
            if(_.isNumber(authId) && authId > 0) {
                db.deleteAuthorization(MSAuth.userId, authId, function (err, result) {
                    if(err) {
                        res.send(500, { error: err });
                    } else {
                        res.send(200);
                    }
                });
            } else {
                res.send(400, { error: 'Invalid authorization id.' });
            }
        } else {
            res.send(401, { error: 'Not authenticated.' });
        }
    },

    list: function listAuthentications (req, res) {
        res.send(501);
    },

    retrieve: function retrieveAuthentication (req, res) {
        res.send(501);
    }
};