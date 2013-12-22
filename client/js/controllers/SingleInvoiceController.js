define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleInvoiceController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.invoice = BN.getInvoiceById($routeParams.invoiceId);
        $.sendAck = {};

        $.orderCountText = function () {
            if($.invoice.orderCount === 0) {
                return 'no orders';
            } else if($.invoice.orderCount === 1) {
                return '1 order';
            } else {
                return $.invoice.orderCount + ' orders';
            }
        };

        $.complete = function () {
            BN.updateInvoice($.invoice.id, { statusId: 2 }, function (invoice) {
                _.extend($.invoice, invoice);
                //$location.path('/invoices');
            });
        };

        $.send = function () {
            BN.sendInvoice($.invoice.id, function (ack) {
                _.extend($.sendAck, ack);
            });
        };

        $.removeOrder = function (item) {
//            BN.updateOrderItemQuantity($.order.id, item.id, 0, function (order) {
//                $.order = order;
//            });
        };

        $.selectOrder = function (order) {
            if($.selectedOrder === order) {
                delete $.selectedOrder;
            } else {
                $.selectedOrder = order;
            }
        };

        $.clearSelectedOrder = function () {
            delete $.selectedOrder;
        };
    } ]);
});