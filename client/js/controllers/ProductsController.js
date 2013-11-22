define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('ProductsController', [ '$scope', 'BeurrageNet', function ($, BN) {
        $.products = BN.getProducts();
    } ]);
});