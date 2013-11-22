define([ './app' ], function (app) {
    'use strict';

    return app.config([ '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: 'html/views/home.html',
            controller: 'HomeController'
        });

        $routeProvider.when('/products', {
            templateUrl: 'html/views/products.html',
            controller: 'ProductsController'
        });

        $routeProvider.when('/orders', {
            templateUrl: 'html/views/orders.html',
            controller: 'OrdersController'
        });

        $routeProvider.when('/documents', {
            templateUrl: 'html/views/documents.html',
            controller: 'DocumentsController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]);
});