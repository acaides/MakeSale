define([ './app' ], function (app) {
    'use strict';

    return app.config([ '$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: '/html/views/home.html',
            controller: 'HomeController'
        });

        $routeProvider.when('/auth', {
            templateUrl: '/html/views/auth.html',
            controller: 'MSAuthController'
        });

        $routeProvider.when('/products', {
            templateUrl: '/html/views/products/products.html',
            controller: 'ProductsController'
        });

        $routeProvider.when('/products/add', {
            templateUrl: '/html/views/products/addProduct.html',
            controller: 'AddProductController'
        });

        $routeProvider.when('/products/groups', {
            templateUrl: '/html/views/products/productGroups.html',
            controller: 'ProductGroupsController'
        });

        $routeProvider.when('/products/groups/add', {
            templateUrl: '/html/views/products/addProductGroup.html',
            controller: 'AddProductGroupController'
        });

        $routeProvider.when('/products/groups/:productGroupId', {
            templateUrl: '/html/views/products/singleProductGroup.html',
            controller: 'SingleProductGroupController'
        });

        $routeProvider.when('/products/:productId', {
            templateUrl: '/html/views/products/singleProduct.html',
            controller: 'SingleProductController'
        });

        $routeProvider.when('/products/:productId/addPrice', {
            templateUrl: '/html/views/products/addProductPrice.html',
            controller: 'AddProductPriceController'
        });

        $routeProvider.when('/products/:productId/prices/:priceId', {
            templateUrl: '/html/views/products/singleProductPrice.html',
            controller: 'SingleProductPriceController'
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

        $routeProvider.when('/customers', {
            templateUrl: '/html/views/customers/customers.html',
            controller: 'CustomersController'
        });

        $routeProvider.when('/customers/add', {
            templateUrl: '/html/views/customers/addCustomer.html',
            controller: 'AddCustomerController'
        });

        $routeProvider.when('/customers/:customerId', {
            templateUrl: '/html/views/customers/singleCustomer.html',
            controller: 'SingleCustomerController'
        });

        $routeProvider.when('/invoices', {
            templateUrl: '/html/views/invoices/invoices.html',
            controller: 'InvoicesController'
        });

        $routeProvider.when('/invoices/start', {
            templateUrl: '/html/views/invoices/startInvoice.html',
            controller: 'StartInvoiceController'
        });

        $routeProvider.when('/invoices/:invoiceId/addOrder', {
            templateUrl: '/html/views/invoices/addOrder.html',
            controller: 'AddOrderController'
        });

        $routeProvider.when('/invoices/:invoiceId', {
            templateUrl: '/html/views/invoices/singleInvoice.html',
            controller: 'SingleInvoiceController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]);
});