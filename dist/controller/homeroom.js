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
    var homeroomCount = 0;

    // '/homeroom/:hubId' - Create new homeroom
    api.post('/create/:hubId', function (req, res) {
        _hub2.default.findById(req.params.hubId, function (err, hub) {
            if (err) {
                res.send(err);
            }
            var newHomeroom = new _homeroom2.default();
            newHomeroom.roomName = req.body.roomName;
            newHomeroom.hub = hub._id;
            newHomeroom.save(function (err, homeroom) {
                if (err) {
                    res.send(err);
                }
                hub.homerooms.push(newHomeroom);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                homeroom.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: newHomeroom.roomName + ' successfully added to ' + hub.hubName });
                });
            });
        });
    });

    // '/homeroom/' - Read all homerooms
    api.get('/', function (req, res, next) {
        _homeroom2.default.find({}, function (err, homeroom) {
            if (err) {
                res.send(err);
            }
            res.json(homeroom);
        });
    });

    // '/homeroom/:roomId' - Read homeroom by id
    api.get('/:roomId', function (req, res) {
        //.findById method
        _homeroom2.default.findById(req.params.roomId, function (err, homeroom) {
            if (err) {
                res.send(err);
            }
            res.json(homeroom);
        });
    });

    // '/homeroom/:roomId' - Update homeroom
    api.put('/update/:roomId', function (req, res) {
        _homeroom2.default.findById(req.params.roomId, function (err, homeroom) {
            if (err) {
                res.send(err);
            }
            if (req.body.roomName !== undefined) {
                homeroom.roomName = req.body.roomName;
            }
            homeroom.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: homeroom.roomName + ' info updated' });
            });
        });
    });

    // '/homeroom/:roomId' - Remove homeroom
    api.delete('/remove/:roomId', function (req, res) {
        var id = req.params.roomId;
        _homeroom2.default.findById(id, function (err, homeroom) {
            var homeroomName = homeroom.roomName;
            _hub2.default.find({ homerooms: id }, function (err, hub) {
                if (err) {
                    res.send(err);
                }
                hub.homerooms.pull(homeroom);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            _homeroom2.default.remove({ _id: req.params.roomId }, function (err, homeroom) {
                if (err) {
                    res.send(err);
                }
                id = homeroom.teachers;
                _teacher2.default.remove(id, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                id = homeroom.students;
                _student2.default.remove(id, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                homeroomCount--;
                res.json({ message: homeroomName + " successfully removed" });
            });
        });
    });

    return api;
};
//# sourceMappingURL=homeroom.js.map
//# sourceMappingURL=homeroom.js.map