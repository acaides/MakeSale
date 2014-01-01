define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductPriceController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.product = BN.getProductById($routeParams.productId);

        BN.getProductPrices($routeParams.productId, function (prices) {
            _.forEach(prices, function (price) {
                if(price.id == $routeParams.priceId) {
                    $.price = price;
                    $.unitPrice = price.unitPrice;
                    return false;
                }
            });
        });

        $.update = function SingleProductPriceControllerUpdate () {
            var p = {
                orderTypeId: $.selectedOrderType,
                unitPrice: $.unitPrice
            };

            if($.selectedCustomer !== -1) {
                p.customerId = $.selectedCustomer;
            }

            BN.updateProductPrice($routeParams.productId, $routeParams.priceId, $.unitPrice, function (productPrice) {
                $location.path('/products/' + $routeParams.productId);
            });
        };
    } ]);
});