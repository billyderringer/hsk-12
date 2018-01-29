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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    // '/student/:roomId' - Create new students
    api.post('/:roomId', function (req, res) {
        _homeroom2.default.findById(req.params.roomId, function (err, homeroom) {
            if (err) {
                res.send(err);
            }
            var newStudent = new _student2.default();
            newStudent.firstName = req.body.firstName;
            newStudent.lastName = req.body.lastName;
            newStudent.gradeLevel = req.body.gradeLevel;
            newStudent.homerooms = homeroom._id;
            newStudent.hub = homeroom.hub;
            var name = newStudent.firstName + ' ' + newStudent.lastName;
            _hub2.default.findById(newStudent.hub, function (err, hub) {
                if (err) {
                    res.send(err);
                }
                hub.students.push(newStudent);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            newStudent.save(function (err, student) {
                if (err) {
                    res.send(err);
                }
                homeroom.students.push(newStudent);
                homeroom.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                student.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'Student: ' + name + ' successfully saved to ' + homeroom.roomName });
                });
            });
        });
    });

    // '/student/' - Read all students
    api.get('/', function (req, res) {
        _student2.default.find({}, function (err, students) {
            if (err) {
                res.send(err);
            }
            res.json(students);
        });
    });

    // '/student/:roomId' - Read students by roomId
    api.get('/:roomId', function (req, res) {
        var id = req.params.roomId;
        _student2.default.find({ homerooms: id }, function (err, students) {
            if (err) {
                res.send(err);
            }
            res.json(students);
        });
    });

    // '/student/:studentId/teachers' - Read teachers by studentId
    api.get('/:studentId/teachers', function (req, res) {
        var id = req.params.studentId;
        _student2.default.find({ teachers: id }, function (err, teachers) {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/student/:studentId' - Read student by studentId
    api.get('/:studentId', function (req, res) {
        _student2.default.findById(req.params.studentId, function (err, student) {
            if (err) {
                res.send(err);
            }
            res.json(student);
        });
    });

    // '/student/:studentId' - Update student basic info
    api.patch('/:studentId', function (req, res) {
        _student2.default.findById(req.params.studentId, function (err, student) {
            if (err) {
                res.send(err);
            }
            if (req.body.firstName !== undefined) {
                student.firstName = req.body.firstName;
            }
            if (req.body.lastName !== undefined) {
                student.lastName = req.body.lastName;
            }
            if (req.body.gradeLevel !== undefined) {
                student.gradeLevel = req.body.gradeLevel;
            }
            student.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: student.firstName + ' ' + student.lastName + ': Info updated successfully' });
            });
        });
    });

    // '/:studentId' - Delete student
    api.delete('/:studentId', function (req, res) {
        _student2.default.findById(req.params.studentId, function (err, student) {
            var name = student.firstName + ' ' + lastName;
            var id = student._id;
            if (err) {
                res.send(err);
            }
            _hub2.default.find({ students: id }, function (err, hub) {
                hub.pull(student);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            _homeroom2.default.find({ students: id }, function (err, room) {
                room.pull(student);
                room.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            _teacher2.default.find({ students: id }, function (err, teacher) {
                teacher.pull(student);
                teacher.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            _student2.default.remove(id, function (err) {
                if (err) {
                    res.send(err);
                }
            });
            res.json({ message: 'Student: ' + name + ' successfully removed' });
        });
    });

    return api;
};
//# sourceMappingURL=student.js.map