define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddProductGroupController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.productGroup = {};

        $.add = function AddProductGroupControllerAdd () {
            BN.addProductGroup($.productGroup, function (productGroup) {
                if(!productGroup.error) {
                    $location.path('/products/groups');
                }
            });
        };
    } ]);
});