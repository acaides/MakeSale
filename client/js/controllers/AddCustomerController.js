define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddCustomerController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.customer = {};
        $.adding = false;
        $.add = function () {
            $.adding = true;
            BN.addCustomer($.customer, function () {
                $.adding = false;
                $location.path('/customers');
            });
        };
    } ]);
});