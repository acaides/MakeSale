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
            d0s = moment().startOf('month').toDate(),
            d0e = moment().endOf('month').toDate(),
            d1s = moment().subtract('month', 1).startOf('month').toDate(),
            d1e = moment().subtract('month', 1).endOf('month').toDate(),
            d2s = moment().subtract('month', 2).startOf('month').toDate(),
            d2e = moment().subtract('month', 2).endOf('month').toDate();

        $.orderSuggestions = [
            {
                name: 'All Orders Completed In ' + monthNames[d0s.getMonth()],
                start: d0s.toString(),
                end: d0e.toString()
            },
            {
                name: 'All Orders Completed In ' + monthNames[d1s.getMonth()],
                start: d1s.toString(),
                end: d1e.toString()
            },
            {
                name: 'All Orders Completed In ' + monthNames[d2s.getMonth()],
                start: d2s.toString(),
                end: d2e.toString()
            },
            {
                name: 'Nothing',
                start: null,
                end: null
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
                billedToCustomerId: $.selectedCustomer.id,
                billedToName: $.selectedCustomer.name,
                billedToAddress: $.selectedCustomer.address,
                billedToPhone: $.selectedCustomer.phone,
                billedToEmail: $.selectedCustomer.email
            }, function (invoice) {
                if($.selectedOrderSuggestion.start !== null) {
                    BN.getOrders({
                        customerId: $.selectedCustomer.id,
                        statusId: 2,
                        modifiedOnOrAfter: $.selectedOrderSuggestion.start,
                        modifiedOnOrBefore: $.selectedOrderSuggestion.end
                    }, function (orders) {
                        if(orders.length) {
                            BN.addInvoiceOrders(invoice.id, orders, function (orders) {
                                if(!invoice.error) {
                                    $location.path('/invoices/' + invoice.id);
                                }
                            });
                        } else {
                            $location.path('/invoices/' + invoice.id);
                        }
                    });
                } else {
                    $location.path('/invoices/' + invoice.id);
                }
            });
        };
    } ]);
});