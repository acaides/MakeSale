define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleOrderController', [ '$scope', 'BeurrageNet', '$routeParams', '$timeout', function ($, BN, $routeParams, $timeout) {
        $.order = BN.getOrderById($routeParams.orderId);

        $.itemCountText = function () {
            if($.order.itemCount === 0) {
                return 'no items';
            } else if($.order.itemCount === 1) {
                return '1 item';
            } else {
                return $.order.itemCount + ' items';
            }
        };

        $.itemQtyChange = function (item) {
            BN.updateOrderItemQuantity($.order.id, item.id, item.quantity, function (order) {
                $.order = order;
            });
        };

        $.complete = function () {
            BN.updateOrder($.order.id, { statusId: 2 }, function (order) {
                angular.extend($.order, order);
            });
        };

        $.removeItem = function (item) {
            BN.updateOrderItemQuantity($.order.id, item.id, 0, function (order) {
                $.order = order;
            });
        };

        $.selectItem = function (item) {
            if($.selectedItem === item) {
                delete $.selectedItem;
            } else {
                $.selectedItem = item;
            }
        };

        $.clearSelectedItem = function () {
            delete $.selectedItem;
        };
    } ]);
});