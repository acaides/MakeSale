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

            getOrderById: function BNGetOrderById (orderId) {
                var order = {};

                $http({ method: 'GET', url: SB + 'orders/' + orderId }).
                    success(function(data, status, headers, config) {
                        angular.extend(order, data);

                        order.createdTimestamp = new Date(order.createdTimestamp);
                        order.modifiedTimestamp = new Date(order.modifiedTimestamp);
                    }).
                    error(function(data, status, headers, config) {

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
            }
        };
    } ]);
});