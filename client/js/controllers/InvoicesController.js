define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('InvoicesController', [ '$scope', 'BeurrageNet', function ($, BN) {
        BN.getInvoices(function (invoices) {
            $.allInvoices = invoices;
            $.unpaidInvoices = [];

            angular.forEach(invoices, function (invoice) {
                if(invoice.statusId !== 4) {
                    $.unpaidInvoices.push(invoice);
                }
            });

            $.invoices = $.unpaidInvoices;
        });

        $.showingPaid = false;

        $.toggleShowingPaid = function () {
            $.showingPaid = !$.showingPaid;

            if($.showingPaid) {
                $.invoices = $.allInvoices;
            } else {
                $.invoices = $.unpaidInvoices;
            }
        };

        $.itemCountText = function (invoice) {
            if(invoice.itemCount === 0) {
                return 'no items';
            } else if(invoice.itemCount === 1) {
                return '1 item';
            } else {
                return invoice.itemCount + ' items';
            }
        };
    } ]);
});