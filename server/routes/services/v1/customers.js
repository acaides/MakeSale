var db = require('../../../db'),
    _ = require('lodash');

module.exports = {
    create: function createCustomers (req, res) {
        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            db.insertCustomers(req.body, function (err, result) {
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
                                name: result.firstName,
                                email: result.email,
                                address: 'address' in result ? result.address : undefined,
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

    list: function listCustomers (req, res) {
        db.selectCustomers({}, function (err, customers) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, customers);
            }
        });
    },

    retrieve: function retrieveCustomer (req, res) {
        var customerId = parseInt(req.param('customerId'), 10);

        if(_.isNumber(customerId) && customerId > 0) {
            db.selectCustomersById(customerId, function (err, customers) {
                if(err) {
                    res.send(500, { error: err });
                } else if(customers.length !== 1) {
                    res.send(404, { error: 'No such customer.' });
                } else {
                    res.send(200, customers[0]);
                }
            });
        } else {
            res.send(400, { error: 'Invalid customer id.' });
        }
    }
};