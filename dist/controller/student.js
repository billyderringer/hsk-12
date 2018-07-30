'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _authMiddleware = require('../middleware/authMiddleware');

var _schoolTerm = require('../model/schoolTerm');

var _schoolTerm2 = _interopRequireDefault(_schoolTerm);

var _student = require('../model/student');

var _student2 = _interopRequireDefault(_student);

var _assignment = require('../model/assignment');

var _assignment2 = _interopRequireDefault(_assignment);

var _subject = require('../model/subject');

var _subject2 = _interopRequireDefault(_subject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var api = (0, _express.Router)();

    // '/student/...' - Create new student
    api.post('/create/:termId', _authMiddleware.authenticate, function (req, res) {
        _schoolTerm2.default.findById(req.params.termId, function (err, term) {
            if (err) {
                res.send(err + ' :err finding term by id');
            }
            var newStudent = new _student2.default();
            newStudent.firstName = req.body.firstName;
            newStudent.lastName = req.body.lastName;
            newStudent.gradeLevel = req.body.gradeLevel;
            newStudent.teacher = term.teacher;
            newStudent.term = term._id;
            newStudent.save(function (err) {
                if (err) {
                    res.send(err + ' :err saving new student');
                }
                term.students.push(newStudent);
                term.save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving student to term');
                    }
                    res.json({ message: 'new student saved' });
                });
            });
        });
    });

    // Update student basic info
    api.patch('/update/:studentId', _authMiddleware.authenticate, function (req, res) {
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
                res.json({ message: 'student info updated successfully' });
            });
        });
    });

    // Get students by termId
    api.get('/term/:termId', function (req, res) {
        _student2.default.find({ term: req.params.termId }, function (err, students) {
            if (students === null) {
                res.json('students not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(students);
            }
        });
    });

    //Get student by id
    api.get('/:studentId', function (req, res) {
        _student2.default.findById(req.params.studentId, function (err, student) {
            console.log(student);
            if (student === null) {
                res.json('student not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(student);
            }
        });
    });

    // Delete student
    api.delete('/remove/:studentId', _authMiddleware.authenticate, function (req, res) {
        var id = req.params.studentId;

        _student2.default.findById(id, function (err, student) {
            if (err) {
                res.send(err + ' :err finding student by id');
            }
            _schoolTerm2.default.find({ students: id }, function (err, term) {
                if (err) {
                    res.send(err + ' :err finding term by studentId');
                }
                term[0].students.pull(student);
                term[0].save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving term');
                    }
                });
            });
            _student2.default.remove({ _id: req.params.studentId }, function (err) {
                if (err) {
                    res.send(err + ' :err removing Student');
                }
                _subject2.default.remove({ student: id }, function (err, subject) {
                    if (err) {
                        res.send(err + ' :err removing subject in student');
                    }
                    if (subject === null) {
                        res.status(404).send("subject not found");
                    }

                    _assignment2.default.remove({ student: id }, function (err, assignment) {
                        if (err) {
                            res.send(err + ' :err removing assignment in student');
                        }
                        if (assignment === null) {
                            res.status(404).send("assignment not found");
                        }
                    });
                });
            });
        });
        res.json({ message: "student successfully removed" });
    });

    return api;
};
//# sourceMappingURL=student.js.map