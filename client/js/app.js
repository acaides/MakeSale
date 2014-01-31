define([
    'angular',
    './services/index',
    './controllers/index'
], function (ng) {
    'use strict';

    return ng.module('net.beurrage', [
        'ngRoute',
        'ngResource',
        'ngAnimate',
        'ngTouch',
        'net.beurrage.services',
        'net.beurrage.controllers'
    ]);
});