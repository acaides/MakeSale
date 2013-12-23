var db = require('../../../db'),
    _ = require('lodash');

module.exports = {
    create: function createInvoiceOrders (req, res) {
        var invoiceId = parseInt(req.param('invoiceId'), 10);

        if(!_.isNumber(invoiceId) || invoiceId < 1) {
            res.send(400, { error: 'Invalid invoice id.' } );
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

            db.insertInvoiceOrders(invoiceId, req.body, function (err, result) {
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

    list: function listInvoiceOrders (req, res) {
        var invoiceId = parseInt(req.param('invoiceId'), 10);

        if(_.isNumber(invoiceId) && invoiceId > 0) {
            db.selectInvoiceOrdersByInvoiceId(invoiceId, function (err, invoiceOrders) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    res.send(200, invoiceOrders);
                }
            });
        } else {
            res.send(400, { error: 'Invalid invoice id.' });
        }
    },

    destroy: function destroyInvoiceOrder (req, res) {
        var invoiceId = parseInt(req.param('invoiceId'), 10),
            orderId = parseInt(req.param('orderId'), 10);

        if(_.isNumber(orderId) && orderId > 0 && _.isNumber(invoiceId) && invoiceId > 0) {
            db.deleteInvoiceOrder(invoiceId, orderId, function (err, result) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    db.selectInvoiceById(invoiceId, function (err, invoice) {
                        if(err) {
                            res.send(500, { error: err });
                        } else {
                            db.selectInvoiceOrdersByInvoiceId(invoiceId, function (err, invoiceOrders) {
                                if(err) {
                                    res.send(500, { error: err });
                                } else {
                                    invoice.orders = invoiceOrders;
                                    res.send(200, invoice);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.send(400, {
                error: 'Invalid id.'
            });
        }
    }
};