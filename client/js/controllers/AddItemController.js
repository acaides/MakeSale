define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddItemController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.order = BN.getOrderById($routeParams.orderId);
        $.products = BN.getProducts({ orderId: $routeParams.orderId });
        $.quantity = 1;
        $.add = function () {
            $.adding = true;
            BN.addOrderItem($routeParams.orderId, $.selectedProduct.id, $.quantity, function (order) {
                $.adding = false;
                $location.path('/orders/' + $routeParams.orderId);
            });
        };
        $.select = function (product) {
            $.selectedProduct = product;
        };
    } ]);
});