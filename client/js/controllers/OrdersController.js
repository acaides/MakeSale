define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('OrdersController', [ '$scope', 'BeurrageNet', function ($, BN) {
        $.orders = BN.getOrders();

        $.itemCountText = function (order) {
            if(order.itemCount === 0) {
                return 'no items';
            } else if(order.itemCount === 1) {
                return '1 item';
            } else {
                return order.itemCount + ' items';
            }
        }
    } ]);
});