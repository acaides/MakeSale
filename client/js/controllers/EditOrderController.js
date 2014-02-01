define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('EditOrderController', [ '$scope', 'MSApi', '$routeParams', '$location', function ($, MSApi, $routeParams, $location) {
        $.order = MSApi.getOrderById($routeParams.orderId, function (order) {
            $.customers = MSApi.getCustomers(function (customers) {
                angular.forEach(customers, function (customer) {
                    if(customer.id === order.customerId) {
                        $.selectedCustomer = customer;
                        return false;
                    }
                });
            });

            $.types = MSApi.getOrderTypes(function (types) {
                angular.forEach(types, function (type) {
                    if(type.id === order.typeId) {
                        $.selectedType = type;
                        return false;
                    }
                });
            });

            $.name = order.name;
        });

        $.selectCustomer = function (customer) {
            if($.selectedCustomer === customer) {
                delete $.selectedCustomer;
            } else {
                $.selectedCustomer = customer;
            }
        };

        $.selectType = function (type) {
            if($.selectedType === type) {
                delete $.selectedType;
            } else {
                $.selectedType = type;
            }
        };
        $.save = function () {
            var mod = false,
                mods = {};

            if($.name !== $.order.name) {
                mods.name = $.name;
                mod = true;
            }

            if($.selectedCustomer.id !== $.order.customerId) {
                mods.customerId = $.selectedCustomer.id;
                mod = true;
            }

            if($.selectedType.id !== $.order.typeId) {
                mods.typeId = $.selectedType.id;
                mod = true;
            }

            if(mod) {
                MSApi.updateOrder($.order.id, mods, function (order) {
                    $location.path('/orders/' + order.id);
                });
            }
        };
    } ]);
});