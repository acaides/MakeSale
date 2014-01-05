define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('ProductGroupsController', [ '$scope', 'BeurrageNet', function ($, BN) {
        $.productGroups = BN.getProductGroups();
    } ]);
});