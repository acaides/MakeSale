define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddProductController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.product = {
            enabled: true
        };
        $.units = BN.getUnits();
        $.selectUnit = function (unit) {
            if($.selectedUnit === unit) {
                delete $.selectedUnit;
            } else {
                $.selectedUnit = unit;
            }
        };

        $.add = function AddProductControllerAdd () {
            $.product.unitId = $.selectedUnit.id;

            BN.addProduct($.product, function (product) {
                $location.path('/products');
            });
        };
    } ]);
});