'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _schoolModel = require('../model/schoolModel');

var _schoolModel2 = _interopRequireDefault(_schoolModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/v1/school/add' - Create
    api.post('/add', function (req, res) {
        var newSchool = new _schoolModel2.default();
        newSchool.name = req.body.name;
        newSchool.principalName = req.body.principalName;
        newSchool.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: newSchool.name + ' has been created successfully' });
        });
    });

    // '/v1/school' - Read
    api.get('/', function (req, res) {
        _schoolModel2.default.find({}, function (err, schools) {
            if (err) {
                res.send(err);
            }
            res.json(schools);
        });
    });

    // '/v1/school/:id' - Read 1
    api.get('/:id', function (req, res) {
        //.findById method
        _schoolModel2.default.findById(req.params.id, function (err, school) {
            if (err) {
                res.send(err);
            }
            res.json(school);
        });
    });

    // '/v1/school/:id' - Update
    api.put('/:id', function (req, res) {
        _schoolModel2.default.findById(req.params.id, function (err, updatedSchool) {
            if (err) {
                res.send(err);
            }
            updatedSchool.name = req.body.name;
            updatedSchool.principalName = req.body.principalName;
            updatedSchool.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: updatedSchool.name + ' info updated' });
            });
        });
    });

    // '/v1/school/:id' - Delete
    api.delete('/:id', function (req, res) {
        _schoolModel2.default.remove({ _id: req.params.id }, function (err, deletedSchool) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "School successfully removed" });
        });
    });

    return api;
};
//# sourceMappingURL=classroomController.js.map