var db = require('../../db'),
    _ = require('lodash');

module.exports = function getInvoiceDocument (req, res) {
    var invoiceId = parseInt(req.param('invoiceId'), 10),
        accessCode = ('' + req.param('ac')).toUpperCase();

    db.selectInvoiceById(invoiceId, function (err, invoice) {
        if(err) {
            res.send(404, 'Unable to retrieve invoice.');
        } else {
            if(invoice.accessCode === accessCode) {
                db.selectInvoiceOrdersByInvoiceId(invoiceId, function (err, invoiceOrders) {
                    if(err) {
                        res.send(404, 'Unable to retrieve invoice orders.');
                    } else {
                        invoice.orders = invoiceOrders;
                        res.render('invoice.jade', {
                            invoice: invoice
                        });
                    }
                });
            } else {
                res.send(403, 'Unauthorized request for invoice.');
            }
        }
    });
};