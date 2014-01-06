define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductGroupController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.productGroup = BN.getProductGroupById($routeParams.productGroupId, function (pg) {
            $.origName = pg.name;
        });

        $.products = BN.getProducts({ notAsGroups: true });
        $.toggleProductInclusion = function SingleProductGroupControllerToggleProductInclusion (product) {
            var cb = function () {
                $.products = BN.getProducts({ notAsGroups: true });
            };

            if('' + product.productGroupId === '' + $routeParams.productGroupId) {
                BN.updateProduct(product.id, { productGroupId: null }, cb);
            } else {
                BN.updateProduct(product.id, { productGroupId: $routeParams.productGroupId }, cb);
            }
        };

        $.update = function SingleProductGroupControllerUpdate () {
            BN.updateProductGroup($routeParams.productGroupId, $.productGroup, function (pg) {
                if(!pg.error) {
                    $location.path('/products/groups');
                }
            });
        };
    } ]);
});