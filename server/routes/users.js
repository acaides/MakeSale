var db = require('../db');

exports.create = function (req, res) {
    db.createUser({}, req.body, function (err, user) {
        if(err) {
            res.send(400, {
                error: err
            });
        } else {
            res.send(201, user);
        }
    });
};

/*
 * GET users listing.
 */

//exports.list = function(req, res){
//  res.send({
//      one: 1,
//      two: '2',
//      three: [ 3, '3' ]
//  });
//};