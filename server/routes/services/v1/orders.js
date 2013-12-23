var db = require('../../../db'),
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
                            db.selectOrderById(result.insertId, function (err, order) {
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
        db.selectOrders(req.query, function (err, orders) {
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
            db.selectOrderById(orderId, function (err, order) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    db.selectOrderItemsByOrderId(order.id, function (err, orderItems) {
                        if(err) {
                            res.send(500, { error: err });
                        } else {
                            order.items = orderItems;
                            res.send(200, order);
                        }
                    });
                }
            });
        } else {
            res.send(400, { error: 'Invalid order id.' });
        }
    },

    modify: function modifyOrder (req, res) {
        var orderId = parseInt(req.param('orderId'), 10),
            acceptedKeys = [ 'customerId', 'typeId', 'statusId', 'name' ],
            mods = {};

        _.forEach(req.body, function (value, key) {
            if(acceptedKeys.indexOf(key) !== -1) {
                mods[key] = value;
            }
        });

        if(_.isNumber(orderId) && orderId > 0) {
            if(_.size(mods) > 0) {
                db.updateOrder(orderId, mods, function (err, order) {
                    if(err) {
                        res.send(err.forbidden ? 403 : 500, err);
                    } else {
                        res.send(200, order);
                    }
                });
            } else {
                res.send(400, { error: 'No valid modifications specified.' });
            }
        } else {
            res.send(400, { error: 'Invalid order id.' });
        }
    }
};