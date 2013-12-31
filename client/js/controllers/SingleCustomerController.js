define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleCustomerController', [ '$scope', 'BeurrageNet', '$routeParams', '$location', function ($, BN, $routeParams, $location) {
        $.customer = BN.getCustomerById($routeParams.customerId);
        $.changed = false;
        $.updating = false;

        $.update = function () {
            $.updating = true;
            BN.updateCustomer($.customer.id, $.customer, function (customer) {
                $.updating = false;
                $.customer = customer;
                $location.path('/customers');
            });
        };
    } ]);
});