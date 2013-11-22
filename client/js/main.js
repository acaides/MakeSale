require.config({
    // alias libraries paths
    paths: {
        domReady: '../lib/requirejs/domReady',
        angular: '../lib/angularjs/angular',
        'angular-route': '../lib/angularjs/angular-route',
        'angular-resource': '../lib/angularjs/angular-resource'
    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': {
            deps: [ 'angular' ]
        },
        'angular-resource': {
            deps: [ 'angular' ]
        }
    },

    // kick start application
    deps: [ './bootstrap' ]
});