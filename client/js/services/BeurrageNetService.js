define([ './module' ], function (services) {
    'use strict';

    var SB = '/services/v1/';

    services.service('BeurrageNet', [ '$http', function ($http) {
        return {
            getProducts: function BNGetProducts (orderId) {
                var products = [];

                $http({ method: 'GET', url: SB + 'products' + (orderId ? ('?orderId=' + orderId) : '') }).
                    success(function(data, status, headers, config) {
                        angular.extend(products, data);
                    }).
                    error(function(data, status, headers, config) {

                    });

                return products;
            },

            getProductById: function BNGetProductById (productId) {
                var product = {};

                $http({ method: 'GET', url: SB + 'products/' + productId }).
                    success(function(data, status, headers, config) {
                        angular.extend(product, data);
                    }).
                    error(function(data, status, headers, config) {

                    });

                return product;
            },

            getCustomers: function BNGetCustomers (cb) {
                var c = angular.isFunction(cb) ? cb : function () {},
                    customers = [];

                $http({ method: 'GET', url: SB + 'customers' }).
                    success(function(data, status, headers, config) {
                        angular.extend(customers, data);
                        c(customers);
                    }).
                    error(function(data, status, headers, config) {
                        angular.extend(customers, data);
                        c(customers);
                    });

                return customers;
            },

            startOrder: function BNStartOrder (customerId, typeId, name, cb) {
                var order = {
                    loading: true
                };

                $http({ method: 'POST', url: SB + 'orders/', data: { customerId: customerId, typeId: typeId, name: name } }).
                    success(function(data, status, headers, config) {
                        delete order.loading;
                        angular.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);

                        if(angular.isFunction(cb)) {
                            cb(order);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        delete order.loading;
                        angular.extend(order, data);

                        if(angular.isFunction(cb)) {
                            cb(order);
                        }
                    });

                return order;
            },

            getOrders: function BNGetOrders () {
                var orders = [];

                $http({ method: 'GET', url: SB + 'orders' }).
                    success(function(data, status, headers, config) {
                        angular.extend(orders, data);

                        angular.forEach(orders, function (order) {
                            order.createdTimestamp = new Date(order.createdTimestamp);
                            order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        });
                    }).
                    error(function(data, status, headers, config) {

                    });

                return orders;
            },

            getOrderTypes: function BNGetOrderTypes (cb) {
                var c = angular.isFunction(cb) ? cb : function () {},
                    orderTypes = [];

                $http({ method: 'GET', url: SB + 'orders/types' }).
                    success(function(data, status, headers, config) {
                        angular.extend(orderTypes, data);
                        c(orderTypes);
                    }).
                    error(function(data, status, headers, config) {
                        angular.extend(orderTypes, data);
                        c(orderTypes);
                    });

                return orderTypes;
            },

            getOrderById: function BNGetOrderById (orderId, cb) {
                var c = angular.isFunction(cb) ? cb : function () {},
                    order = {
                        loading: true
                    };

                $http({ method: 'GET', url: SB + 'orders/' + orderId }).
                    success(function(data, status, headers, config) {
                        delete order.loading;
                        angular.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        c(order);
                    }).
                    error(function(data, status, headers, config) {
                        delete order.loading;
                        angular.extend(order, data);
                        c(order);
                    });

                return order;
            },

            addOrderItem: function BNAddOrderItem (orderId, productId, quantity, cb) {
                var order = {};

                $http({ method: 'POST', url: SB + 'orders/' + orderId + '/items', data: { productId: productId, quantity: quantity } }).
                    success(function(data, status, headers, config) {
                        angular.extend(order, data);

//                        order.createdTimestamp = new Date(order.createdTimestamp);
//                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);

                        if(angular.isFunction(cb)) {
                            cb(order);
                        }
                    }).
                    error(function(data, status, headers, config) {

                    });

                return order;
            },

            updateOrderItemQuantity: function BNUpdateOrderItemQuantity (orderId, itemId, newQuantity, cb) {
                var order = {};

                $http({ method: 'PATCH', url: SB + 'orders/' + orderId + '/items/' + itemId, data: { quantity: newQuantity } }).
                    success(function(data, status, headers, config) {
                        angular.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);

                        if(angular.isFunction(cb)) {
                            cb(order);
                        }
                    }).
                    error(function(data, status, headers, config) {

                    });

                return order;
            },

            updateOrder: function BNUpdateOrder (orderId, mods, cb) {
                var c = angular.isFunction(cb) ? cb : function () {},
                    order = {
                        loading: true
                    };

                $http({ method: 'PATCH', url: SB + 'orders/' + orderId, data: mods }).
                    success(function(data, status, headers, config) {
                        delete order.loading;
                        angular.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                        c(order);
                    }).
                    error(function(data, status, headers, config) {
                        delete order.loading;
                        angular.extend(order, data);
                        c(order);
                    });

                return order;
            }
        };
    } ]);
});