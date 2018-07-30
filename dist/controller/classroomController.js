'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _schoolModel = require('../model/schoolModel');

var _schoolModel2 = _interopRequireDefault(_schoolModel);

var _classroomModel = require('../model/classroomModel');

var _classroomModel2 = _interopRequireDefault(_classroomModel);

var _teacherModel = require('../model/teacherModel');

var _teacherModel2 = _interopRequireDefault(_teacherModel);

var _studentModel = require('../model/studentModel');

var _studentModel2 = _interopRequireDefault(_studentModel);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    var classroomCount = 0;

    // '/hub/create' - Create Homeroom
    api.post('/create', function (req, res, next) {
        var newClassroom = new _classroomModel2.default();
        newClassroom.roomName = req.body.roomName;
        newClassroom.save(function (err, classroom) {
            if (err) {
                res.send(err);
            }
            classroom.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: newClassroom.roomName + ' has been created successfully' });
                classroomCount++;
                console.log(classroomCount);
            });
        });
    });

    // '/hub' - Read all classrooms
    api.get('/', function (req, res, next) {
        _classroomModel2.default.find({}, function (err, classes) {
            if (err) {
                res.send(err);
            }
            res.json(classes);
        });
    });

    // '/hub/:hubId' - Read classroom by id
    api.get('/:hubId', function (req, res) {
        //.findById method
        _classroomModel2.default.findById(req.params.hubId, function (err, classroom) {
            if (err) {
                res.send(err);
            }
            res.json(classroom);
        });
    });

    // '/hub/update/:hubId' - Update classroom
    api.put('/update/:hubId', function (req, res) {
        _classroomModel2.default.findById(req.params.hubId, function (err, classroom) {
            if (err) {
                res.send(err);
            }
            classroom.roomName = req.body.roomName;
            classroom.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: classroom.roomName + ' info updated' });
            });
        });
    });

    // '/hub/remove/:id' - Delete classroom
    api.delete('/remove/:id', function (req, res) {
        _classroomModel2.default.remove({ _id: req.params.id }, function (err, deletedClass) {
            if (err) {
                res.send(err);
            }
            var id = deletedClass.teachers;
            _teacherModel2.default.remove(id, function (err, teachers) {
                if (err) {
                    res.send(err);
                }
            });
            id = deletedClass.students;
            _studentModel2.default.remove(id, function (err, students) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Homeroom successfully removed" });
            });
        });
    });

    return api;
};
//# sourceMappingURL=homeroom.js.map
//# sourceMappingURL=classroomController.js.map