define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddCustomerController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.customer = {};
        $.adding = false;
        $.add = function () {
            $.adding = true;
            MSApi.addCustomer($.customer, function () {
                $.adding = false;
                $location.path('/customers');
            });
        };
    } ]);
});