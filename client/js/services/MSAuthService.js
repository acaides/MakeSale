define([ './module' ], function (services) {
    'use strict';

    services.service('MSAuth', [ 'MSApi', function (MSApi) {
        var authentication = (function () {
                try {
                    return JSON.parse(localStorage['MSAuth.authentication']);
                } catch (e) {
                    return null;
                }
            })(),
            authenticated = !!authentication;

        if(!!authentication) {
            MSApi.setAuthToken(authentication.token);
        }

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
                MSApi.createAuthentication(email, password, (new Date()).toLocaleString(), function (auth) {
                    if(!auth.error) {
                        authentication = _.extend({ email: email }, auth);
                        authenticated = true;
                        localStorage['MSAuth.authentication'] = JSON.stringify(authentication);
                        MSApi.setAuthToken(authentication.token);
                    }

                    if(_.isFunction(cb)) {
                        cb(_.extend({ email: email }, auth));
                    }
                });
            },

            revokeAuthentication: function MSAuthRevokeAuthentication (cb) {
                MSApi.deleteAuthentication(authentication.id, function () {
                    authenticated = false;
                    authentication = null;
                    localStorage['MSAuth.authentication'] = null;
                    MSApi.clearAuthToken();

                    if(_.isFunction(cb)) {
                        cb({});
                    }
                });
            }
        };
    } ]);
});