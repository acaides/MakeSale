var db = require('../../../db'),
    _ = require('lodash');

module.exports = {
    create: function createProducts (req, res) {
        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            db.insertProducts(req.body, function (err, result) {
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
                                name: result.name,
                                description: 'description' in result ? result.description : undefined,
                                unitId: result.unitId,
                                enabled: result.enabled
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

    list: function listProducts (req, res) {
        var options = {};

        if('orderId' in req.query) {
            var orderId = parseInt(req.query.orderId, 10);

            if(_.isNumber(orderId) && orderId > 0) {
                options.orderId = orderId;
            } else {
                res.send(400, { error: 'Invalid order id.' });
                return;
            }
        }

        db.selectProducts(options, function (err, products) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, products);
            }
        });
    },

    retrieve: function retrieveProduct (req, res) {
        var productId = parseInt(req.param('productId'), 10);

        if(_.isNumber(productId) && productId > 0) {
            db.selectProductsById(productId, function (err, products) {
                if(err) {
                    res.send(500, { error: err });
                } else if(products.length !== 1) {
                    res.send(404, { error: 'No such product.' });
                } else {
                    res.send(200, products[0]);
                }
            });
        } else {
            res.send(400, { error: 'Invalid product id.' });
        }
    },

    modify: function modifyProduct (req, res) {
        var pMods = req.body,
            productId = parseInt(req.param('productId'), 10);

        if(!_.isNumber(productId) || productId < 1) {
            res.send(400, { error: 'Invalid product id.' });
            return;
        }

        if(_.isPlainObject(pMods)) {
            db.updateProduct(productId, pMods, function (err, product) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, product);
                }
            });
        } else {
            res.send(400, { error: 'No product modifications specified.' });
        }
    }
};