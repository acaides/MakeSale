var db = require('../db'),
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

        if(_.isNumber(invoiceId) && invoiceId > 0) {
            db.selectInvoiceById(invoiceId, function (err, invoice) {
                if(err) {
                    res.send(500, { error: err });
                } else {
                    db.selectInvoiceItemsByInvoiceId(invoice.id, function (err, invoiceItems) {
                        if(err) {
                            res.send(500, { error: err });
                        } else {
                            invoice.items = invoiceItems;
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
        var invoices = _.isArray(req.body) ? req.body : [ req.body ];

        _.forEach(invoices, function (invoice) {
            invoice.createdUserId = 1;
            invoice.modifiedUserId = 1;
            invoice.accessCode = '00000000';
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
    modify: function modifyInvoice (req, res) {}
};