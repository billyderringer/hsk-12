'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _hub = require('../model/hub');

var _hub2 = _interopRequireDefault(_hub);

var _homeroom = require('../model/homeroom');

var _homeroom2 = _interopRequireDefault(_homeroom);

var _teacher = require('../model/teacher');

var _teacher2 = _interopRequireDefault(_teacher);

var _student = require('../model/student');

var _student2 = _interopRequireDefault(_student);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    return api;
};
//# sourceMappingURL=data.js.map
//# sourceMappingURL=data.js.map