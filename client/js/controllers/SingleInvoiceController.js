define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('SingleInvoiceController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.invoice = MSApi.getInvoiceById($routeParams.invoiceId);
        $.sendAck = {};

        $.orderCountText = function () {
            if($.invoice.orderCount === 0) {
                return 'no orders';
            } else if($.invoice.orderCount === 1) {
                return '1 order';
            } else {
                return $.invoice.orderCount + ' orders';
            }
        };

        $.complete = function () {
            MSApi.updateInvoice($.invoice.id, { statusId: 2 }, function (invoice) {
                _.extend($.invoice, invoice);
                //$location.path('/invoices');
            });
        };

        $.send = function () {
            MSApi.sendInvoice($.invoice.id, function (ack) {
                _.extend($.sendAck, ack);
            });
        };

        $.orderClick = function (order) {
            if($.removingOrder === order) {
                delete $.removingOrder;
            } else {
                $location.url('/orders/' +  order.id + '?from=/invoices/' + $.invoice.id);
            }
        };

        $.adjustmentClick = function (adjustment) {
            if($.removingAdjustment) {
                delete $.removingAdjustment;
            } else {
                $location.url('/invoices/' + $.invoice.id + '/adjustments/' + adjustment.id);
            }
        };

        $.removeOrder = function (order, force) {
            if(!force) {
                $.removingOrder = order;
            } else {
                delete $.removingOrder;

                MSApi.removeInvoiceOrder($.invoice.id, order.id, function (invoice) {
                    $.invoice = invoice;
                });
            }
        };

        $.removeAdjustment = function (adjustment, force) {
            if(!force) {
                $.removingAdjustment = adjustment;
            } else {
                delete $.removingAdjustment;
//
//                MSApi.removeInvoiceAdjustment($.invoice.id, adjustment.id, function (invoice) {
//                    $.invoice = invoice;
//                });
            }
        };

        $.selectOrder = function (order) {
            if($.selectedOrder === order) {
                delete $.selectedOrder;
            } else {
                $.selectedOrder = order;
            }
        };

        $.clearSelectedOrder = function () {
            delete $.selectedOrder;
        };
    } ]);
});