var db = require('../db'),
    _ = require('lodash');

module.exports = {
    list: function listOrderTypes (req, res) {
        db.selectOrderTypes({}, function (err, orderTypes) {
            if(err) {
                res.send(500, { error: err });
            } else {
                res.send(200, orderTypes);
            }
        });
    }
};