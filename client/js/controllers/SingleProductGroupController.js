define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductGroupController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.productGroup = MSApi.getProductGroupById($routeParams.productGroupId, function (pg) {
            $.origName = pg.name;
        });

        $.products = MSApi.getProducts({ notAsGroups: true });
        $.toggleProductInclusion = function SingleProductGroupControllerToggleProductInclusion (product) {
            var cb = function () {
                $.products = MSApi.getProducts({ notAsGroups: true });
            };

            if('' + product.productGroupId === '' + $routeParams.productGroupId) {
                MSApi.updateProduct(product.id, { productGroupId: null }, cb);
            } else {
                MSApi.updateProduct(product.id, { productGroupId: $routeParams.productGroupId }, cb);
            }
        };

        $.update = function SingleProductGroupControllerUpdate () {
            MSApi.updateProductGroup($routeParams.productGroupId, $.productGroup, function (pg) {
                if(!pg.error) {
                    $location.path('/products/groups');
                }
            });
        };
    } ]);
});