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
            delete $.addError;
            $.adding = true;

            if('selectedUnit' in $ && 'name' in $.product) {
                $.product.unitId = $.selectedUnit.id;

                BN.addProduct($.product, function (product) {
                    delete $.adding;

                    if(product.error) {
                        $.addError = 'DUPLICATE';
                    } else {
                        $location.path('/products');
                    }
                });
            } else {
                $.addError = 'MISSING_INFO';
            }
        };
    } ]);
});