var db = require('../../../db'),
    docs = require('../../../docs'),
    crypto = require('crypto'),
    _ = require('lodash');

module.exports = {
    list: function listInvoices (req, res) {
        db.selectInvoices(function (err, invoices) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, invoices);
            }
        });
    },
    retrieve: function retrieveInvoice (req, res) {
        var invoiceId = parseInt(req.param('invoiceId'), 10);

        if(!_.isNaN(invoiceId) && invoiceId > 0) {
            db.selectInvoiceById(invoiceId, function (err, invoice) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    db.selectInvoiceOrdersByInvoiceId(invoice.id, function (err, invoiceOrders) {
                        if(err) {
                            res.send(500, { error: err });
                        } else {
                            invoice.orders = invoiceOrders;
                            res.send(200, invoice);
                        }
                    });
                }
            });
        } else {
            res.send(400, { error: 'Invalid invoice id.' });
        }
    },
    create: function createInvoice (req, res) {
        var invoices = _.isArray(req.body) ? req.body : [ req.body ],
            currentDate = (new Date()).valueOf().toString();

        _.forEach(invoices, function (invoice) {
            invoice.createdUserId = 1;
            invoice.modifiedUserId = 1;
            invoice.accessCode = crypto.createHash('sha1').update(currentDate + Math.random().toString()).digest('hex');
        });

        db.insertInvoices(invoices, function (err, result) {
            if(err) {
                if('inputError' in err) {
                    res.send(400, { error: err.inputError })
                } else {
                    res.send(500, { error: err });
                }
            } else {
                db.selectInvoiceById(result.insertId, function (err, invoice) {
                    if(err) {
                        res.send(500, { error: err });
                    } else {
                        res.send(200, invoice);
                    }
                });
            }
        });
    },
    modify: function modifyInvoice (req, res) {
        var invoiceId = parseInt(req.param('invoiceId'), 10),
            acceptedKeys = [ 'statusId' ],
            mods = {};

        _.forEach(req.body, function (value, key) {
            if(acceptedKeys.indexOf(key) !== -1) {
                mods[key] = value;
            }
        });

        if(!_.isNaN(invoiceId) && invoiceId > 0) {
            if(_.size(mods) > 0) {
                db.updateInvoice(invoiceId, mods, function (err, order) {
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
            res.send(400, { error: 'Invalid invoice id.' });
        }
    },
    send: function sendInvoice (req, res) {
        var invoiceId = parseInt(req.param('invoiceId'), 10);

        console.log('SEND INVOICE ' + invoiceId);


    }
};