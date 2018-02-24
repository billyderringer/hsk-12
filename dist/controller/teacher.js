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

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();
    var teacherCount = 0;

    // '/teacher/register' - Create new teachers
    api.post('/register', function (req, res) {
        _teacher2.default.register(new _teacher2.default({
            username: req.body.email
        }), req.body.password, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            _passport2.default.authenticate('local', {
                session: false
            })(req, res, function () {
                res.status(200).send('Successfully created new account');
            });
        });
    });

    api.post('/login', _passport2.default.authenticate('local', {
        session: false,
        scope: []
    }), _authMiddleware.generateAccessToken, _authMiddleware.respond);

    // 'v1/account/logout' - Logout
    api.get('/logout', _authMiddleware.authenticate, function (req, res) {
        res.logout();
        res.status(200).send('Successfully logged out');
    });

    api.get('/me', _authMiddleware.authenticate, function (req, res) {
        res.status(200).json(req.user);
    });

    // '/teacher/:roomId' - Create new teachers
    api.post('/:roomId', function (req, res) {
        _homeroom2.default.findById(req.params.roomId, function (err, homeroom) {
            if (err) {
                res.send(err);
            }
            var newTeacher = new _teacher2.default();
            newTeacher.firstName = req.body.firstName;
            newTeacher.lastName = req.body.lastName;
            newTeacher.homerooms = req.params.roomId;
            newTeacher.hub = homeroom.hub;
            _hub2.default.findById(newTeacher.hub, function (err, hub) {
                if (err) {
                    res.send(err);
                }
                hub.teachers.push(newTeacher);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            newTeacher.save(function (err, teacher) {
                if (err) {
                    res.send(err);
                }
                homeroom.teachers.push(newTeacher);
                homeroom.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                teacher.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    teacherCount++;
                    res.json({ message: 'Teacher: ' + newTeacher.firstName + ' ' + newTeacher.lastName + ' successfully added to ' + homeroom.roomName });
                });
            });
        });
    });

    // '/teacher' - Read all teachers
    api.get('/', function (req, res) {
        _teacher2.default.find({}, function (err, teachers) {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/teacher/:roomId' - Read all teachers by classId
    api.get('/:roomId', function (req, res) {
        var id = req.params.roomId;
        _teacher2.default.find({ homerooms: id }, function (err, teachers) {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/teacher/:teacherId/students' - Read students by teacherId
    api.get('/:teacherId/students', function (req, res) {
        var id = req.params.teacherId;
        _teacher2.default.find({ students: id }, function (err, students) {
            if (err) {
                res.send(err);
            }
            res.json(students);
        });
    });

    // '/teacher/:teacherId' - Read teacher by teacherId
    api.get('/:teacherId', function (req, res) {
        _teacher2.default.findById(req.params.teacherId, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            res.json(teacher);
        });
    });

    // '/teacher/:id' - Update teacher basic info
    api.patch('/update/:teacherId', function (req, res) {
        _teacher2.default.findById(req.params.teacherId, function (err, teacher) {
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
                res.json({ message: teacher.firstName + ' ' + teacher.lastName + ': Info updated successfully' });
            });
        });
    });

    // '/teacher/:teacherId/assign/:studentId' - Assign students to teacher
    api.post('/:teacherId/assign/:studentId', function (req, res) {
        _teacher2.default.findById(req.params.teacherId, function (err, teacher) {
            var teacherName = teacher.firstName + ' ' + teacher.lastName;
            if (err) {
                res.send(err);
            }
            _student2.default.findById(req.params.studentId, function (err, student) {
                var studentName = student.firstName + ' ' + student.lastName;
                if (err) {
                    res.send(err);
                }
                teacher.students.push(student);
                teacher.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                student.teachers.push(teacher);
                student.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                res.json({ message: studentName + ' successfully assigned to ' + teacherName });
            });
        });
    });

    // '/teacher/:teacherId' - Delete teacher
    api.delete('/remove/:teacherId', function (req, res) {
        _teacher2.default.findById(req.params.teacherId, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            _hub2.default.findById(teacher.hub, function (err, hub) {
                if (err) {
                    res.send(err);
                }
                hub.teachers.pull(teacher);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            _homeroom2.default.findById(teacher.homerooms, function (err, homeroom) {
                if (err) {
                    res.send(err);
                }
                homeroom.teachers.pull(teacher);
                homeroom.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
            });

            _teacher2.default.remove(teacher, function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Teacher successfully removed" });
            });
        });
    });

    return api;
};
//# sourceMappingURL=teacher.js.map