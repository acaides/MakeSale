require.config({
    // alias libraries paths
    paths: {
        domReady: '../lib/requirejs/domReady',
        angular: '../lib/angularjs/angular',
        'angular-route': '../lib/angularjs/angular-route'
    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-route': {
            deps: [ 'angular' ]
        }
    },

    // kick start application
    deps: [ './bootstrap' ]
});