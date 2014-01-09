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

        var pi = 0,
            groupStyle = {
                height: 'auto'
            },
            productStyles = {};

        $.rowStyle = function (product) {
            return product.group ? groupStyle : productStyles[product.id] || (productStyles[product.id] = {
                background: pi++ % 2 === 0 ? 'transparent' : 'rgba(128, 70, 24, 0.05)'
            });
        };
    } ]);
});