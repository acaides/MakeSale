var mysql = require('mysql'),
    dbc = mysql.createConnection({
        host: 'localhost',
        user: 'beurrageDotNet',
        password: 'V8e80ih&}8C472w02/gPlR73',
        database: 'beurrage',
        supportBigNumbers: true
    }),
    sqlTemplates = require('./sqlTemplates.json'),
    bcrypt = require('bcrypt'),
    _ = require('lodash');

module.exports = {
    /**
     * Create a new user.
     *
     * @param authUser  The existing user authorizing the creation of the new user.
     * @param newUsers  An object or array of objects specifying the new user(s) to be created.
     * @param cb        Callback to be passed the result of the action.
     */
    createUser: function DBCreateUser (authUser, newUsers, cb) {
        var results = [],
            requests = _.isArray(newUsers) ? newUsers : [ newUsers ],
            done = function (result) {
                results.push(result);

                if(results.length === requests.length) {
                    if(_.isFunction(cb)) {
                        if(results.length === 1) {
                            cb.apply(results[0], results[0]);
                        } else {
                            cb(false, results);
                        }
                    }
                }
            };

        _.forEach(requests, function (newUser) {
            if('firstName' in newUser &&
                'lastName' in newUser &&
                'email' in newUser &&
                'password' in newUser &&
                'address' in newUser) {

                bcrypt.hash(newUser.password, 8, function (err, hash) {
                    if(!err) {
                        dbc.query(sqlTemplates.INSERT_USER, [
                            newUser.firstName,
                            newUser.lastName,
                            newUser.email,
                            hash,
                            null,
                            new Date(),
                            newUser.address,
                            newUser.phoneNumber,
                            1
                        ], function (err, result) {
                            if(err) {
                                done([ err ]);
                            } else {
                                done([ false, _.extend(result, newUser) ]);
                            }
                        });
                    } else {
                        done([ 'Error hashing password.' ]);
                    }
                });
            } else {
                done([ 'Missing required information in newUser.' ]);
            }
        });
    }
};