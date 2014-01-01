var db = require('../../../db'),
    _ = require('lodash');

module.exports = {

    list: function listUnits (req, res) {
        var options = {};

        db.selectUnits(options, function (err, units) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, units);
            }
        });
    },

    retrieve: function retrieveUnit (req, res) {
        var unitId = parseInt(req.param('unitId'), 10);

        if(_.isNumber(unitId) && unitId > 0) {
            db.selectUnitsById(unitId, function (err, units) {
                if(err) {
                    res.send(500, { error: err });
                } else if(units.length !== 1) {
                    res.send(404, { error: 'No such unit.' });
                } else {
                    res.send(200, units[0]);
                }
            });
        } else {
            res.send(400, { error: 'Invalid unit id.' });
        }
    }
};