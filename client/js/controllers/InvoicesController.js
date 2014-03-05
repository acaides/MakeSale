define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('InvoicesController', [ '$scope', 'MSApi', function ($, MSApi) {
        $.loading = true;

        MSApi.getInvoices(function (invoices) {
            $.allInvoices = invoices;
            $.unpaidInvoices = [];

            angular.forEach(invoices, function (invoice) {
                if(invoice.statusId !== 4) {
                    $.unpaidInvoices.push(invoice);
                }
            });

            $.invoices = $.unpaidInvoices;
            $.loading = false;
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

        $.orderCountText = function (invoice) {
            if(invoice.orderCount === 0) {
                return 'no orders';
            } else if(invoice.orderCount === 1) {
                return '1 order';
            } else {
                return invoice.orderCount + ' orders';
            }
        };
    } ]);
});
