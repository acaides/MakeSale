define([ './app' ], function (app) {
    'use strict';

    return app.config([ '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: '/html/views/home.html',
            controller: 'HomeController'
        });

        $routeProvider.when('/products', {
            templateUrl: '/html/views/products/products.html',
            controller: 'ProductsController'
        });

        $routeProvider.when('/products/add', {
            templateUrl: '/html/views/products/addProduct.html'
        });

        $routeProvider.when('/products/:productId', {
            templateUrl: '/html/views/products/singleProduct.html',
            controller: 'SingleProductController'
        });

        $routeProvider.when('/orders', {
            templateUrl: '/html/views/orders.html',
            controller: 'OrdersController'
        });

        $routeProvider.when('/documents', {
            templateUrl: '/html/views/documents.html',
            controller: 'DocumentsController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]);
});