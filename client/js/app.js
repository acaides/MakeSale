'use strict';

define([
    'angular',
    './services/index',
    './controllers/index',
    './directives/index',
    './filters/index'
], function (ng) {
    'use strict';

    return ng.module('co.makesale.client.mobile.web', [
        'ngRoute',
        'ngResource',
        'ngAnimate',
        'ngTouch',
        'co.makesale.client.mobile.web.services',
        'co.makesale.client.mobile.web.controllers',
        'co.makesale.client.mobile.web.directives',
        'co.makesale.client.mobile.web.filters'
    ]);
});
