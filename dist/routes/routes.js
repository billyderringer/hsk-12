'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('../middleware/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _data = require('../controller/data');

var _data2 = _interopRequireDefault(_data);

var _hub = require('../controller/hub');

var _hub2 = _interopRequireDefault(_hub);

var _homeroom = require('../controller/homeroom');

var _homeroom2 = _interopRequireDefault(_homeroom);

var _teacher = require('../controller/teacher');

var _teacher2 = _interopRequireDefault(_teacher);

var _student = require('../controller/student');

var _student2 = _interopRequireDefault(_student);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

// connect to db
(0, _db2.default)(function (db) {

    //now connected to database
    // internal middleware
    router.use((0, _middleware2.default)({ config: _config2.default, db: db }));

    //api routes
    router.use('/data', (0, _data2.default)({ config: _config2.default, db: db }));
    router.use('/hub', (0, _hub2.default)({ config: _config2.default, db: db }));
    router.use('/homeroom', (0, _homeroom2.default)({ config: _config2.default, db: db }));
    router.use('/teacher', (0, _teacher2.default)({ config: _config2.default, db: db }));
    router.use('/student', (0, _student2.default)({ config: _config2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=routes.js.map