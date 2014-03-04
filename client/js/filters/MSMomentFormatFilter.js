/*global define*/

/**
 * MSMomentFormatFilter
 *
 * This file defines the moment filter, allowing declarative access to the
 * momentjs date formatter.
 */
define([ './module' ], function MSMomentFormatFilterDefinition (filters) {
    'use strict';

    filters.filter('moment', function MSMomentFormatFilter () {
        return function (date, format) {
            var m = moment(date);
            return m.isValid() ? m.format(format) : date;
        };
    });
});
