define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductGroupController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.productGroup = BN.getProductGroupById($routeParams.productGroupId, function (pg) {
            $.origName = pg.name;
        });

        $.products = BN.getProducts(null, $routeParams.productGroupId);

        $.update = function SingleProductGroupControllerUpdate () {
            BN.updateProductGroup($routeParams.productGroupId, $.productGroup, function (pg) {
                if(!pg.error) {
                    $location.path('/products/groups');
                }
            });
        };
    } ]);
});