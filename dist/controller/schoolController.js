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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/hub/add' - Create new school
    api.post('/add', function (req, res) {
        var newHub = new _schoolModel2.default();
        newHub.hubName = req.body.hubName;
        newHub.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: newHub.hubName + ' has been created successfully' });
        });
    });

    // '/hub' - Read all schools
    api.get('/', function (req, res) {
        _schoolModel2.default.find({}, function (err, hub) {
            if (err) {
                res.send(err);
            }
            res.json(hub);
        });
    });

    // '/hub/teachers/:schoolId' - Read all teachers
    api.get('/teachers/:schoolId', function (req, res) {
        _schoolModel2.default.findById(req.params.schoolId, function (err, school) {
            if (err) {
                res.send(err);
            }
            res.json(school.teachers);
        });
    });

    // '/hub/students/:schoolId' - Read all students
    api.get('/students/:schoolId', function (req, res) {
        _schoolModel2.default.findById(req.params.schoolId, function (err, school) {
            if (err) {
                res.send(err);
            }
            res.json(school.students);
        });
    });

    // '/hub/update' - Update
    api.put('/update', function (req, res) {
        _schoolModel2.default.find({}, function (err, hub) {
            if (err) {
                res.send(err);
            }
            hub.hubName = req.body.roomName;
            hub.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: hub.hubName + ' info updated' });
            });
        });
    });

    // '/hub/remove' - Delete
    api.delete('/remove/:id', function (req, res) {
        _schoolModel2.default.remove({ _id: req.params.id }, function (err, deletedHub) {
            if (err) {
                res.send(err);
            }
            var idClassRooms = deletedHub.classrooms;
            var idTeachers = deletedHub.teachers;
            var idStudents = deletedHub.students;
            _classroomModel2.default.remove(idClassRooms, function (err, classrooms) {
                if (err) {
                    res.send(err);
                }
            });
            _teacherModel2.default.remove(idTeachers, function (err, teachers) {
                if (err) {
                    res.send(err);
                }
            });
            _studentModel2.default.remove(idStudents, function (err, students) {
                if (err) {
                    res.send(err);
                }
            });
            res.json({ message: "Classroom successfully removed" });
        });
    });

    return api;
};
//# sourceMappingURL=hubController.js.map