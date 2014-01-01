define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.product = BN.getProductById($routeParams.productId, function (product) {
            $.selectUnit(product.unitId);
        });
        $.units = BN.getUnits();
        $.selectUnit = function (unit) {
            if($.selectedUnit === unit) {
                delete $.selectedUnit;
            } else {
                $.selectedUnit = unit;
            }
        };
        $.prices = BN.getProductPrices($routeParams.productId);

        $.update = function SingleProductControllerUpdate () {
            BN.updateProduct($.product.id, $.product, function () {
                $location.path('/products');
            });
        };
    } ]);
});