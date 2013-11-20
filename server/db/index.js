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
     * Inserts a new user into the database.
     *
     * @param newUsers  An object or array of objects specifying the new user(s) to be created.
     * @param cb        Callback to be passed the result of the action.
     */
    insertUsers: function DBInsertUsers (newUsers, cb) {
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
    },

    selectUsersById: function DBSelectUsersById (userIds, cb) {},

    selectUsersByEmail: function DBSelectUsersByEmail (userEmails, cb) {},

    insertCustomers: function DBInsertCustomers (newCustomers, cb) {
        var results = [],
            requests = _.isArray(newCustomers) ? newCustomers : [ newCustomers ],
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

        _.forEach(requests, function (newCustomer) {
            if('name' in newCustomer && 'email' in newCustomer) {
                dbc.query(sqlTemplates.INSERT_CUSTOMER, [
                    newCustomer.name,
                    newCustomer.address,
                    newCustomer.phone,
                    newCustomer.email
                ], function (err, result) {
                    if(err) {
                        done([ err ]);
                    } else {
                        done([ false, _.extend(result, newCustomer) ]);
                    }
                });
            } else {
                done([ 'Missing required information in newCustomer.' ]);
            }
        });
    },

    selectCustomersById: function DBSelectCustomersById (customerIds, cb) {}
};