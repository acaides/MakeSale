require.config({
    // alias libraries paths
    paths: {
        domReady: '../lib/requirejs/domReady',
        angular: '../lib/angularjs/angular',
        'angular-touch': '../lib/angularjs/angular-touch',
        'angular-route': '../lib/angularjs/angular-route',
        'angular-resource': '../lib/angularjs/angular-resource',
        'angular-animate': '../lib/angularjs/angular-animate'
    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': {
            deps: [ 'angular' ]
        },
        'angular-touch': {
            deps: [ 'angular' ]
        },
        'angular-resource': {
            deps: [ 'angular' ]
        },
        'angular-animate': {
            deps: [ 'angular' ]
        }
    },

    // kick start application
    deps: [ './bootstrap' ]
});