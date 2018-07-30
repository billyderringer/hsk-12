'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
    _mongoose2.default.Promise = global.Promise;
    var db = _mongoose2.default.connect(_config2.default.mongoUrl, { useMongoClient: true });
    callback(db);
};
//# sourceMappingURL=db.js.map