define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleCustomerController', [ '$scope', 'BeurrageNet', '$routeParams', function ($, BN, $routeParams) {
        $.customer = BN.getCustomerById($routeParams.customerId);
    } ]);
});