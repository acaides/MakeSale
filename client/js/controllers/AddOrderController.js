define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddOrderController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.customerIds = [];
        $.orders = [];
        $.selectedOrders = [];
        $.invoice = BN.getInvoiceById($routeParams.invoiceId, function (invoice) {
            if(invoice.orders.length) {
                $.similarOrders = true;
                _.forEach(invoice.orders, function (order) {
                    if($.customerIds.indexOf(order.customerId) === -1) {
                        BN.getOrders({
                            statusId: 2,
                            customerId: order.customerId
                        }, function (orders) {
                            $.orders = _.union($.orders, orders);
                        });
                    }

                    $.customerIds.push(order.customerId);
                });
            } else {
                $.orders = BN.getOrders({ statusId: 2 });
            }
        });

        $.add = function () {
            $.adding = true;
            BN.addInvoiceOrders($routeParams.invoiceId, $.selectedOrders, function (order) {
                $.adding = false;
                $location.path('/invoices/' + $routeParams.invoiceId);
            });
        };
        $.selectOrder = function (order) {
            var i = $.selectedOrders.indexOf(order);

            if(i === -1) {
                $.selectedOrders.push(order);
            } else {
                _.pull($.selectedOrders, order);
            }
        };
    } ]);
});