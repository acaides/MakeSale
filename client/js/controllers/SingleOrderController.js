define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleOrderController', [ '$scope', 'BeurrageNet', '$routeParams', function ($, BN, $routeParams) {
        $.order = BN.getOrderById($routeParams.orderId);

        $.itemCountText = function () {
            if($.order.itemCount === 0) {
                return 'no items';
            } else if($.order.itemCount === 1) {
                return '1 item';
            } else {
                return $.order.itemCount + ' items';
            }
        }
    } ]);
});