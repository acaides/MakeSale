define([ './module' ], function (services) {
    'use strict';

    services.service('MSAuth', [ '$http', function ($http) {
        var authenticated = false,
            authentication = null;

        return {
            getAuthentication: function MSAuthGetAuthentication (cb) {
                if(_.isFunction(cb)) {
                    cb(authentication);
                }
            },

            isAuthenticated: function MSAuthIsAuthenticated () {
                return authenticated;
            },

            authenticate: function MSAuthAuthenticate (email, password, cb) {
                authenticated = true;
                authentication = { email: email };

                if(_.isFunction(cb)) {
                    cb(authentication);
                }
            },

            revokeAuthentication: function MSAuthRevokeAuthentication (cb) {
                authenticated = false;
                authentication = null;

                if(_.isFunction(cb)) {
                    cb({});
                }
            }
        };
    } ]);
});