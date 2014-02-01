define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddProductPriceController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.product = MSApi.getProductById($routeParams.productId);
        $.customers = MSApi.getCustomers();
        $.selectCustomer = function (customer) {
            if($.selectedCustomer === customer) {
                delete $.selectedCustomer;
            } else {
                $.selectedCustomer = customer;
            }
        };

        $.orderTypes = MSApi.getOrderTypes();
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

            MSApi.addProductPrice($routeParams.productId, p, function (productPrice) {
                $location.path('/products/' + $routeParams.productId);
            });
        };
    } ]);
});