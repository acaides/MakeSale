define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('ProductGroupsController', [ '$scope', 'MSApi', function ($, MSApi) {
        $.productGroups = MSApi.getProductGroups();
    } ]);
});