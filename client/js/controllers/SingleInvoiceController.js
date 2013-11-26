define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleInvoiceController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.invoice = BN.getInvoiceById($routeParams.invoiceId);

        $.orderCountText = function () {
            if($.invoice.orderCount === 0) {
                return 'no orders';
            } else if($.invoice.orderCount === 1) {
                return '1 orders';
            } else {
                return $.invoice.orderCount + ' orders';
            }
        };

        $.complete = function () {
//            BN.updateOrder($.order.id, { statusId: 2 }, function (order) {
//                angular.extend($.order, order);
//                $location.path('/orders');
//            });
        };

        $.reopen = function () {
//            BN.updateOrder($.order.id, { statusId: 1 }, function (order) {
//                angular.extend($.order, order);
//            });
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