define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleOrderController', [
        '$scope', 'BeurrageNet', '$routeParams', '$location', '$timeout',
        function ($, BN, $routeParams, $location, $timeout) {
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

            var p = null;

            $.itemQtyChange = function (item, immediate) {
                $timeout.cancel(p);

                var f = function () {
                    BN.updateOrderItemQuantity($.order.id, item.id, item.quantity, function (order) {
                        $.order = order;
                    });
                };

                if(immediate) {
                    f();
                } else {
                    p = $timeout(f, 1500);
                }
            };

            $.complete = function () {
                BN.updateOrder($.order.id, { statusId: 2 }, function (order) {
                    angular.extend($.order, order);
                    $location.path('/orders');
                });
            };

            $.reopen = function () {
                BN.updateOrder($.order.id, { statusId: 1 }, function (order) {
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