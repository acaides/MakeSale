define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('OrdersController', [ '$scope', 'BeurrageNet', function ($, BN) {
        $.orders = BN.getOrders();
    } ]);
});