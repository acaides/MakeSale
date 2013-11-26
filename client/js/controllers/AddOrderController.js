define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddOrderController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.invoice = BN.getInvoiceById($routeParams.invoiceId);
        //$.products = BN.getProducts($routeParams.orderId);
        //$.quantity = 1;
        $.add = function () {
//            $.adding = true;
//            BN.addOrderItem($routeParams.orderId, $.selectedProduct.id, $.quantity, function (order) {
//                $.adding = false;
//                $location.path('/orders/' + $routeParams.orderId);
//            });
        };
        $.select = function (order) {
            $.selectedOrder = order;
        };
    } ]);
});