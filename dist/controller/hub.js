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

    // '/hub/create' - Create new hub
    api.post('/create', function (req, res) {
        var newHub = new _hub2.default();
        newHub.hubName = req.body.hubName;
        newHub.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: newHub.hubName + ' has been created successfully' });
        });
    });

    // '/hub/' - Read all hubs
    api.get('/', function (req, res) {
        _hub2.default.find({}, function (err, hub) {
            if (err) {
                res.send(err);
            }
            res.json(hub);
        });
    });

    // '/hub/:hubId' - Read hub by hubId
    api.get('/:hubId', function (req, res) {
        _hub2.default.findById(req.params.hubId, function (err, hub) {
            if (err) {
                res.send(err);
            }
            res.json(hub);
        });
    });

    // '/hub/:hubId' - Update
    api.put('/update/:hubId', function (req, res) {
        _hub2.default.findById(req.params.hubId, function (err, hub) {
            if (err) {
                res.send(err);
            }
            hub.hubName = req.body.hubName;
            hub.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: hub.hubName + ' info updated' });
            });
        });
    });

    // '/hub/:hubId' - Delete
    api.delete('/remove/:hubId', function (req, res) {
        _hub2.default.remove({ _id: req.params.hubId }, function (err, deletedHub) {
            if (err) {
                res.send(err);
            }
            var id = deletedHub.homerooms;
            _homeroom2.default.remove(id, function (err) {
                if (err) {
                    res.send(err);
                }
            });
            id = deletedHub.teachers;
            _teacher2.default.remove(id, function (err) {
                if (err) {
                    res.send(err);
                }
            });
            id = deletedHub.students;
            _student2.default.remove(id, function (err) {
                if (err) {
                    res.send(err);
                }
            });
            res.json({ message: "Hub successfully removed" });
        });
    });

    return api;
};
//# sourceMappingURL=hub.js.map
//# sourceMappingURL=hub.js.map