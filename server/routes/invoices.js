var db = require('../db'),
    _ = require('lodash');

module.exports = {
    list: function listInvoices (req, res) {},
    retrieve: function retrieveInvoice (req, res) {},
    create: function createInvoice (req, res) {
        var invoices = _.isArray(req.body) ? req.body : [ req.body ];

        _.forEach(invoices, function (invoice) {
            invoice.createdUserId = 1;
            invoice.modifiedUserId = 1;
        });

        db.insertInvoices(invoices, function (err, result) {
            if(err) {
                res.send(500, err);
            } else {
                res.send(200, result);
            }
        });
    },
    modify: function modifyInvoice (req, res) {}
};