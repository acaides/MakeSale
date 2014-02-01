define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleCustomerController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.customer = MSApi.getCustomerById($routeParams.customerId);
        $.changed = false;
        $.updating = false;

        $.update = function () {
            $.updating = true;
            MSApi.updateCustomer($.customer.id, $.customer, function (customer) {
                $.updating = false;
                $.customer = customer;
                $location.path('/customers');
            });
        };
    } ]);
});