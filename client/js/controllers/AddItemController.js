define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddItemController', [ '$scope', 'BeurrageNet', '$routeParams', function ($, BN, $routeParams) {
        $.order = BN.getOrderById($routeParams.orderId);
    } ]);
});