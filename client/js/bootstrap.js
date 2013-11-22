define([ 'require', 'angular', 'angular-route', 'angular-resource', 'app', 'routes' ], function (require, ng) {
    'use strict';

    require([ 'domReady!' ], function (document) {
        ng.bootstrap(document, [ 'net.beurrage' ]);
     });
});