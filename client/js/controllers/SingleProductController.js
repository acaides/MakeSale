define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleProductController', [ '$scope', 'BeurrageNet', '$routeParams', function ($, BN, $routeParams) {
        $.product = BN.getProductById($routeParams.productId);
    } ]);
});