define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('CustomersController', [ '$scope', 'BeurrageNet', function ($, BN) {
        $.customers = BN.getCustomers();
    } ]);
});