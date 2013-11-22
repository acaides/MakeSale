define([ './module' ], function (services) {
    'use strict';

    var SB = '/services/v1/';

    services.service('BeurrageNet', [ '$http', function ($http) {
        return {
            getProducts: function BNGetProducts () {
                var products = [];

                $http({ method: 'GET', url: SB + 'products' }).
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
                    }).
                    error(function(data, status, headers, config) {

                    });

                return order;
            }
        };
    } ]);
});