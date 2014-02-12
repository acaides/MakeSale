define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('AddAdjustmentController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.invoice = MSApi.getInvoiceById($routeParams.invoiceId);

        $.adjustment = {};

        $.add = function () {
            $.adding = true;
            MSApi.addInvoiceAdjustment($routeParams.invoiceId, $.adjustment, function (adjustment) {
                $.adding = false;
                $location.path('/invoices/' + $routeParams.invoiceId);
            });
        };
    } ]);
});