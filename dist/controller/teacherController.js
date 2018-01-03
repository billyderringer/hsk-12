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

    // '/classroom/teachers/add/:id' - Create new teachers
    api.post('/add/:id', function (req, res) {
        _schoolModel2.default.findById(req.params.id, function (err, school) {
            if (err) {
                res.send(err);
            }
            var newTeacher = new _teacherModel2.default();
            newTeacher.firstName = req.body.firstName;
            newTeacher.lastName = req.body.lastName;
            newTeacher.hub = hub._id;
            newTeacher.save(function (err, teacher) {
                if (err) {
                    res.send(err);
                }
                hub.teachers.push(newTeacher);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                teacher.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'Teacher successfully added to hub' });
                });
            });
        });
    });

    // '/classroom/teachers/list' - Read all teachers
    api.get('/list', function (req, res) {
        _teacherModel2.default.find({}, function (err, teachers) {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/classroom/teachers/:classId' - Read all teachers by classId
    /*api.get('/:classId', (req, res) => {
        Teacher.find({classrooms: req.params.classId}, (err, teachers) => {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });*/

    // '/classroom/teachers/:id' - Read teacher by id
    api.get('/', function (req, res) {
        _teacherModel2.default.find({}, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            res.json(teacher);
        });
    });

    // '/classroom/teachers/update/:id' - Update
    api.put('/update/:id', function (req, res) {
        _teacherModel2.default.findById(req.params.id, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            if (req.body.firstName !== undefined) {
                teacher.firstName = req.body.firstName;
            }
            if (req.body.lastName !== undefined) {
                teacher.lastName = req.body.lastName;
            }
            teacher.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: teacher.firstName + ' ' + teacher.lastName + '\'s info updated successfully' });
            });
        });
    });

    // '/classroom/teachers/remove/:id' - Delete
    api.delete('/remove/:id', function (req, res) {
        _teacherModel2.default.findById(req.params.id, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            var id = teacher.classrooms;
            _classroomModel2.default.findById(id, function (err, classroom) {
                classroom.teachers.pull(teacher);
                classroom.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    _teacherModel2.default.remove({
                        _id: req.params.id
                    }, function (err, teacher) {
                        if (err) {
                            res.send(err);
                        }
                        res.json({ message: 'Teacher successfully removed' });
                    });
                });
            });
        });
    });

    return api;
};
//# sourceMappingURL=teacher.js.map