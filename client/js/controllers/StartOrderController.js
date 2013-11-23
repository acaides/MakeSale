define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('StartOrderController', [ '$scope', 'BeurrageNet', '$location', function ($, BN, $location) {
        $.customers = BN.getCustomers();
        $.selectCustomer = function (customer) {
            if($.selectedCustomer === customer) {
                delete $.selectedCustomer;
            } else {
                $.selectedCustomer = customer;
            }
        };
        $.types = BN.getOrderTypes();
        $.selectType = function (type) {
            if($.selectedType === type) {
                delete $.selectedType;
            } else {
                $.selectedType = type;
            }
        };
        $.start = function () {
            BN.startOrder($.selectedCustomer.id, $.selectedType.id, $.name, function (order) {
                $location.path('/orders/' + order.id);
            });
        };
    } ]);
});