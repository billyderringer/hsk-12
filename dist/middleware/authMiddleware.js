'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKENTIME = 60 * 60 * 24 * 30; //30 days
var SECRET = '1hav3s3cretsth4ty0uc4ntgues$';
var username = "";
var password = "";

var authenticate = (0, _expressJwt2.default)({ secret: SECRET });
// next parameter is a sign of middleware
var generateAccessToken = function generateAccessToken(req, res, next) {
    req.token = req.token || {};
    req.token = _jsonwebtoken2.default.sign({
        id: req.user.id
    }, SECRET, {
        expiresIn: TOKENTIME
    });
    next();
};

var respond = function respond(req, res) {
    username = req.user.username;
    password = req.token;
    res.status(200).json({
        user: req.user.username,
        token: req.token
    });
};

module.exports = {
    authenticate: authenticate,
    generateAccessToken: generateAccessToken,
    respond: respond,
    username: username,
    password: password
};
//# sourceMappingURL=authMiddleware.js.map