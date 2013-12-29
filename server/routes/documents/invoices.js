var db = require('../../db'),
    _ = require('lodash'),
    fs = require('fs'),
    os = require('os'),
    phantom = require('phantom'),
    masterAccessCode = '',
    serverRoot = '';

function render (invoiceId, accessCode, format, done) {
    phantom.create('--ignore-ssl-errors=yes', function(ph) {
        ph.createPage(function(page) {
            page.set('paperSize', { format: 'Letter', orientation: 'portrait', border: '.25in' });
//            page.set('zoomFactor', 1);
            page.open('https://' + serverRoot + '/documents/invoices/' + invoiceId + '?ac=' + accessCode, function(status) {
                page.render(invoiceId + '.' + format, function () {
                    console.log('Rendered PDF for Invoice #' + invoiceId);
                    ph.exit();
                    done(invoiceId + '.' + format);
                    page.close();
                });
            });
        });
    });
}

function getInvoiceDocument (req, res) {
    var invoiceId = parseInt(req.param('invoiceId'), 10),
        pdf = !!req.param('invoiceId').match(/\.pdf/gi),
        png = !!req.param('invoiceId').match(/\.png/gi),
        accessCode = ('' + req.param('ac'));

    if(pdf || png) {
        render(invoiceId, accessCode, pdf ? 'pdf' : 'png', function (fileName) {
            if(pdf) {
                res.contentType('application/pdf');
            } else {
                res.contentType('image/png');
            }

            fs.readFile(fileName, function (err, data) {
                res.send(data);
            });
        });
    } else {
        db.selectInvoiceById(invoiceId, function (err, invoice) {
            if(err) {
                res.send(404, 'Unable to retrieve invoice.');
            } else {
                if(invoice.accessCode === accessCode || accessCode === masterAccessCode) {
                    db.selectInvoiceOrdersByInvoiceId(invoiceId, function (err, invoiceOrders) {
                        if(err) {
                            res.send(404, 'Unable to retrieve invoice orders.');
                        } else {
                            invoice.orders = invoiceOrders;

                            if(invoice.orders && invoice.orders.length > 0) {
                                _.forEach(invoice.orders, function (order, i) {
                                    db.selectOrderItemsByOrderId(order.id,  function (err, orderItems) {
                                        if(!err) {
                                            order.items = orderItems;
                                        } else {
                                            order.items = [];
                                        }

                                        if(i === invoice.orders.length - 1) {
                                            res.render('invoice.jade', {
                                                invoice: invoice
                                            });
                                        }
                                    });
                                });
                            } else {
                                res.render('invoice.jade', {
                                    invoice: invoice
                                });
                            }
                        }
                    });
                } else {
                    res.send(403, 'Unauthorized request for invoice.');
                }
            }
        });
    }
}

module.exports = function (params) {
    masterAccessCode = params.config.masterAccessCode;
    serverRoot = (function (addr) {
        return addr.address + ':' + addr.port
    })(params.httpsServer.address());

    return getInvoiceDocument;
};