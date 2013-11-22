define([ './app' ], function (app) {
    'use strict';

    return app.config([ '$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'html/views/home.html',
            controller: 'HomeController'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]);
});