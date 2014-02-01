define([ 'require', 'angular', 'angular-route', 'angular-touch', 'angular-resource', 'angular-animate', 'app', 'routes' ], function (require, ng) {
    'use strict';

    require([ 'domReady!' ], function (document) {
        ng.bootstrap(document, [ 'co.makesale.client.mobile.web' ]);
     });
});