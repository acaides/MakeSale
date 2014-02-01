define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('ProductsController', [ '$scope', 'MSApi', function ($, MSApi) {
        $.products = MSApi.getProducts();

        var pi = 0,
            groupStyle = {
                height: 'auto'
            },
            productStyles = {};

        $.rowStyle = function (product) {
            return product.group ? groupStyle : productStyles[product.id] || (productStyles[product.id] = {
                background: pi++ % 2 === 0 ? 'transparent' : 'rgba(128, 70, 24, 0.05)'
            });
        };
    } ]);
});