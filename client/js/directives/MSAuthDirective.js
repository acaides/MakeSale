define([ './module' ], function MSAuthDirectiveDefinition (directives) {
    'use strict';

    directives.directive('msAuth', [
        '$location',
        'MSApi',
        'MSAuth',
        function MSAuthDirective ($location, MSApi, MSAuth) {
            return {
                restrict: 'AE',
                link: function ($, el, attrs) {
//                    if(!MSAuth.isAuthenticated()) {
//                        $location.url('/auth');
//                    }
                }
            };
        }
    ]);
});