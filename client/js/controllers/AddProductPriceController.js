define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddProductPriceController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.product = BN.getProductById($routeParams.productId);
        $.customers = BN.getCustomers();
        $.selectCustomer = function (customer) {
            if($.selectedCustomer === customer) {
                delete $.selectedCustomer;
            } else {
                $.selectedCustomer = customer;
            }
        };

        $.orderTypes = BN.getOrderTypes();
        $.selectOrderType = function (orderType) {
            if($.selectedOrderType === orderType) {
                delete $.selectedOrderType;
            } else {
                $.selectedOrderType = orderType;
            }
        };

        $.add = function AddProductPriceControllerAdd () {
            var p = {
                orderTypeId: $.selectedOrderType,
                unitPrice: $.unitPrice
            };

            if($.selectedCustomer !== -1) {
                p.customerId = $.selectedCustomer;
            }

            BN.addProductPrice($routeParams.productId, p, function (productPrice) {
                $location.path('/products/' + $routeParams.productId);
            });
        };
    } ]);
});