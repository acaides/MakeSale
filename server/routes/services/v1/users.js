var db = require('../../../db'),
    _ = require('lodash');

module.exports = {
    create: function createUsers (req, res) {
        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            db.insertUsers(req.body, function (err, result) {
                if(err) {
                    res.send(400, {
                        error: err
                    });
                } else {
                    var response = [];

                    _.forEach(_.isArray(result) ? result : [ [ err, result ] ], function (rA) {
                        var result = rA.length === 1 ? null : rA[1],
                            error = rA[0];

                        if(result) {
                            response.push({
                                id: result.insertId,
                                firstName: result.firstName,
                                lastName: result.lastName,
                                email: result.email,
                                address: result.address,
                                phone: 'phone' in result ? result.phone : undefined
                            });
                        } else {
                            response.push({
                                error: error
                            });
                        }
                    });

                    res.send(201, response.length === 1 ? response[0] : response);
                }
            });
        }
    },

    list: function listUsers (req, res) {
        res.send(501, { error: 'User listing is not yet implemented.' });
    }
};