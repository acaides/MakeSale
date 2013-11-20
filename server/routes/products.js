var db = require('../db'),
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
                                baseUnitPrice: result.baseUnitPrice,
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
        db.selectProducts(function (err, products) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, products);
            }
        });
    }
};