define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('OrdersController', [ '$scope', 'BeurrageNet', function ($, BN) {
        BN.getOrders(function (orders) {
            $.allOrders = orders;
            $.incompleteOrders = [];

            angular.forEach(orders, function (order) {
                if(order.statusId == 1) {
                    $.incompleteOrders.push(order);
                }
            });

            $.orders = $.incompleteOrders;
        });

        $.showingCompleted = false;

        $.toggleShowingCompleted = function () {
            $.showingCompleted = !$.showingCompleted;

            if($.showingCompleted) {
                $.orders = $.allOrders;
            } else {
                $.orders = $.incompleteOrders;
            }
        };

        $.itemCountText = function (order) {
            if(order.itemCount === 0) {
                return 'no items';
            } else if(order.itemCount === 1) {
                return '1 item';
            } else {
                return order.itemCount + ' items';
            }
        };
    } ]);
});