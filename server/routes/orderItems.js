var db = require('../db'),
    _ = require('lodash');

module.exports = {
    create: function createOrderItems (req, res) {
        var orderId = parseInt(req.param('orderId'), 10);

        if(!_.isNumber(orderId) || orderId < 1) {
            res.send(400, { error: 'Invalid order id.' } );
            return;
        }

        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            var theResult,
                response = [],
                done = function (err, result) {
                    response.push(err || result);

                    if(response.length === theResult.length) {
                        res.send(201, response.length === 1 ? response[0] : response);
                    }
                };

            db.insertOrderItems(orderId, req.body, function (err, result) {
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
                            done(false, result);
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

    list: function listOrderItems (req, res) {
        var orderId = parseInt(req.param('orderId'), 10);

        if(_.isNumber(orderId) && orderId > 0) {
            db.selectOrderItemsByOrderId(orderId, function (err, orderItems) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, orderItems);
                }
            });
        } else {
            res.send(400, { error: 'Invalid order id.' });
        }
    },

    modify: function modifyOrderItem (req, res) {
        var orderId = parseInt(req.param('orderId'), 10),
            orderItemId = parseInt(req.param('orderItemId'), 10);

        if(_.isNumber(orderItemId) && orderItemId > 0 && _.isNumber(orderId) && orderId > 0) {
            if(_.isNumber(req.body.quantity) && req.body.quantity >= 0) {
                db.updateOrderItem(orderId, orderItemId, req.body.quantity, function (err, result) {
                    if(err) {
                        res.send(500, { error: err });
                    } else {
                        db.selectOrderById(orderId, function (err, order) {
                            if(err) {
                                res.send(500, { error: err });
                            } else {
                                db.selectOrderItemsByOrderId(orderId, function (err, orderItems) {
                                    if(err) {
                                        res.send(500, { error: err });
                                    } else {
                                        order.items = orderItems;
                                        res.send(200, order);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.send(400, {
                    error: 'Invalid quantity.'
                });
            }
        } else {
            res.send(400, {
                error: 'Invalid id.'
            });
        }
    }
};