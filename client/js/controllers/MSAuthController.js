define([ './module' ], function (controllers) {
    'use strict';
    controllers.controller('MSAuthController', [ '$scope', 'MSAuth', function ($, MSAuth) {
        MSAuth.getAuthentication(function (auth) {
            $.authenticated = !!auth;
            $.authentication = auth;
        });

        $.signIn = function MSAuthControllerSignIn () {
            $.authenticating = true;
            delete $.authenticationError;
            delete $.authentication;
            delete $.authenticated;

            MSAuth.authenticate($.email, $.password, function (authentication) {
                delete $.authenticating;

                if(authentication.error) {
                    $.authenticationError = authentication.error;
                } else {
                    $.authentication = authentication;
                    $.authenticated = true;
                }
            });
        };

        $.signOut = function MSAuthControllerSignOut () {
            $.revokingAuthentication = true;

            MSAuth.revokeAuthentication(function () {
                delete $.revokingAuthentication;
                delete $.authentication;
                delete $.authenticated;
            });
        };
    } ]);
});