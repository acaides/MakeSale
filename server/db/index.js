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
     * @param newUser   An object specifying the new user to be created.
     * @param cb        Callback to be passed the result of the action.
     */
    createUser: function DBCreateUser (authUser, newUser, cb) {
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
                        if(_.isFunction(cb)) {
                            if(err) {
                                cb(err);
                            } else {
                                cb(false, result);
                            }
                        }
                    });

//                    cb(false, {
//                        firstName: newUser.firstName,
//                        lastName: newUser.lastName,
//                        email: newUser.email,
//                        createdTimestamp: new Date(),
//                        address: newUser.address,
//                        phoneNumber: newUser.phoneNumber
//                    });
                } else {
                    cb('Error hashing password.');
                }
            });
        } else if(_.isFunction(cb)) {
            cb('Missing required information in newUser.');
        }
    }
};