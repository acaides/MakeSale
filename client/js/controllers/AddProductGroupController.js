define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddProductGroupController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.productGroup = {};

        $.add = function AddProductGroupControllerAdd () {
            MSApi.addProductGroup($.productGroup, function (productGroup) {
                if(!productGroup.error) {
                    $location.path('/products/groups');
                }
            });
        };
    } ]);
});