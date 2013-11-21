var db = require('../db'),
    _ = require('lodash');

module.exports = {
    create: function createProductPrice (req, res) {
        var productId = parseInt(req.param('productId'), 10);

        if(!_.isNumber(productId) || productId < 1) {
            res.send(400, {
                error: 'Invalid product id.'
            });

            return;
        }

        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            var theResult,
                response = [],
                done = function (r) {
                    response.push(r);

                    if(response.length === theResult.length) {
                        res.send(201, response.length === 1 ? response[0] : response);
                    }
                };

            db.insertProductPrices(_.extend(req.body, { productId: productId }), function (err, result) {
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
                            done(result);
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

    list: function listProductPrices (req, res) {
        var productId = parseInt(req.param('productId'), 10);

        if(_.isNumber(productId) && productId > 0) {
            db.selectProductPricesByProductId(productId, function (err, orderItems) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, orderItems);
                }
            });
        } else {
            res.send(400, { error: 'Invalid product id.' });
        }
    },

    modify: function modifyProductPrice (req, res) {
        var productId = parseInt(req.param('productId'), 10),
            orderTypeId = parseInt(req.param('orderTypeId'), 10);

        if(!_.isNumber(productId) || productId < 1) {
            res.send(400, { error: 'Invalid product id.' });
            return;
        }

        if(!_.isNumber(orderTypeId) || orderTypeId < 1) {
            res.send(400, { error: 'Invalid order type id.' });
            return;
        }

        if(_.isPlainObject(req.body) && 'unitPrice' in req.body) {
            db.updateProductPrice(productId, orderTypeId, req.body.unitPrice, function (err, result) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, result);
                }
            });
        } else {
            res.send(400, { error: 'Missing unitPrice.' });
        }
    }
};