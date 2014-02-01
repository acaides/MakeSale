define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('CustomersController', [ '$scope', 'MSApi', function ($, MSApi) {
        $.customers = MSApi.getCustomers();
    } ]);
});