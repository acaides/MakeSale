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
            templateUrl: '/html/views/orders/orders.html',
            controller: 'OrdersController'
        });

        $routeProvider.when('/orders/start', {
            templateUrl: '/html/views/orders/startOrder.html',
            controller: 'StartOrderController'
        });

        $routeProvider.when('/orders/:orderId/edit', {
            templateUrl: '/html/views/orders/editOrder.html',
            controller: 'EditOrderController'
        });

        $routeProvider.when('/orders/:orderId', {
            templateUrl: '/html/views/orders/singleOrder.html',
            controller: 'SingleOrderController'
        });

        $routeProvider.when('/orders/:orderId/addItem', {
            templateUrl: '/html/views/orders/addItem.html',
            controller: 'AddItemController'
        });

        $routeProvider.when('/documents', {
            templateUrl: '/html/views/documents/documents.html',
            controller: 'DocumentsController'
        });

        $routeProvider.when('/documents/invoices', {
            templateUrl: '/html/views/documents/invoices/invoices.html',
            controller: 'InvoicesController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]);
});