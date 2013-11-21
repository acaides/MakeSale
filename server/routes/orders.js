var db = require('../db'),
    _ = require('lodash');

module.exports = {
    create: function createOrders (req, res) {
        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            var theResult,
                response = [],
                done = function (r) {
                    response.push(r);

                    if(response.length === theResult.length) {
                        res.send(201, response.length === 1 ? response[0] : response);
                    }
                };

            db.insertOrders(req.body, function (err, result) {
                if(err) {
                    res.send(400, {
                        error: err
                    });
                } else {
                    theResult = _.isArray(result) ? result : [ [ err, result ] ];

                    _.forEach(theResult, function (rA) {
                        var result = rA.length === 1 ? null : rA[1],
                            error = rA[0];

                        if(result) {
                            db.selectOrdersById(result.insertId, function (err, order) {
                                done(order);
                            });
                        } else {
                            done({
                                error: error
                            });
                        }
                    });
                }
            });
        }
    },

    list: function listOrders (req, res) {
        db.selectOrders(function (err, orders) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, orders);
            }
        });
    },

    retrieve: function retrieveOrder (req, res) {
        var orderId = parseInt(req.param('orderId'), 10);

        if(_.isNumber(orderId) && orderId > 0) {
            db.selectOrdersById(orderId, function (err, order) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, order);
                }
            });
        } else {
            res.send(400, { error: 'Invalid order id.' });
        }
    }
};