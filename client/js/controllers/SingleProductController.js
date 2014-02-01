define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.product = MSApi.getProductById($routeParams.productId, function (product) {
            $.selectUnit(product.unitId);
        });
        $.units = MSApi.getUnits();
        $.selectUnit = function (unit) {
            if($.selectedUnit === unit) {
                delete $.selectedUnit;
            } else {
                $.selectedUnit = unit;
            }
        };
        $.prices = MSApi.getProductPrices($routeParams.productId);

        $.update = function SingleProductControllerUpdate () {
            MSApi.updateProduct($.product.id, $.product, function () {
                $location.path('/products');
            });
        };
    } ]);
});