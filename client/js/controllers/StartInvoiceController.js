define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('StartInvoiceController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.customers = BN.getCustomers();
        $.selectCustomer = function (customer) {
            if($.selectedCustomer === customer) {
                delete $.selectedCustomer;
            } else {
                $.selectedCustomer = customer;
            }
        };

        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ],
            now = new Date(),
            m0 = monthNames[now.getMonth()],
            m1 = monthNames[now.getMonth() - 1],
            m2 = monthNames[now.getMonth() - 2];

        $.orderSuggestions = [
            {
                name: 'All Orders Completed In ' + m0
            },
            {
                name: 'All Orders Completed In ' + m1
            },
            {
                name: 'All Orders Completed In ' + m2
            }
        ];
        $.selectOrderSuggestion = function (orderSuggestion) {
            if($.selectedOrderSuggestion === orderSuggestion) {
                delete $.selectedOrderSuggestion;
            } else {
                $.selectedOrderSuggestion = orderSuggestion;
            }
        };

        $.start = function () {
            BN.startInvoice({
                billedToName: $.selectedCustomer.name,
                billedToAddress: $.selectedCustomer.address,
                billedToPhone: $.selectedCustomer.phone,
                billedToEmail: $.selectedCustomer.email
            }, function (invoice) {
                BN.addInvoiceOrders([], function (orders) {
                    if(!invoice.error) {
                        $location.path('/invoices/' + invoice.id);
                    }
                });
            });
        };
    } ]);
});