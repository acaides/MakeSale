define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleOrderController', [ '$scope', 'BeurrageNet', '$routeParams', function ($, BN, $routeParams) {
        $.order = BN.getOrderById($routeParams.orderId);
    } ]);
});