var db = require('../../../db'),
    _ = require('lodash');

module.exports = {
    create: function createProductGroup (req, res) {
        if(_.isPlainObject(req.body) || _.isArray(req.body)) {
            var theResult,
                response = [],
                done = function (r) {
                    response.push(r);

                    if(response.length === theResult.length) {
                        res.send(201, response.length === 1 ? response[0] : response);
                    }
                };

            db.insertProductGroups(req.body, function (err, result) {
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

    list: function listProductGroups (req, res) {
        db.selectProductGroups(function (err, productGroups) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, productGroups);
            }
        });
    },

    modify: function modifyProductGroup (req, res) {
        var productGroupId = parseInt(req.param('productGroupId'), 10);

        if(!_.isNumber(productGroupId) || productGroupId < 1) {
            res.send(400, { error: 'Invalid product group id.' });
            return;
        }

        if(_.isPlainObject(req.body) && 'name' in req.body) {
            db.updateProductGroup(productGroupId, { name: req.body.name }, function (err, result) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, result);
                }
            });
        } else {
            res.send(400, { error: 'Missing name.' });
        }
    },

    retrieve: function retrieveProductGroup (req, res) {
        var productGroupId = parseInt(req.param('productGroupId'), 10);

        if(!_.isNumber(productGroupId) || productGroupId < 1) {
            res.send(400, { error: 'Invalid product group id.' });
            return;
        }

        db.selectProductGroupById(productGroupId, function (err, result) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, result);
            }
        });
    }
};