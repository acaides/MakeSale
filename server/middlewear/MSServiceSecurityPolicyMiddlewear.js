var _ = require('lodash');

module.exports = function MSServiceSecurityPolicyMiddlewear (req, res, next) {
    if((/^\/services\//gi).test(req.path)) {
        if(!!req.MSAuth || (req.path === '/services/v1/authentications' && req.method === 'POST')) {
            next();
        } else {
            res.send(401, { error: 'Service Security Policy Exception: Not authenticated.' });
        }
    } else {
        next();
    }
};