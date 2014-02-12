define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleAdjustmentController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.invoice = MSApi.getInvoiceById($routeParams.invoiceId);
        $.adjustment = MSApi.getAdjustmentById($routeParams.invoiceId, $routeParams.adjustmentId);

        $.update = function () {
            $.adding = true;
            MSApi.updateInvoiceAdjustment($routeParams.invoiceId, $.adjustment, function (adjustment) {
                $.adding = false;
                $location.path('/invoices/' + $routeParams.invoiceId);
            });
        };
    } ]);
});