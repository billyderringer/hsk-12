'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _authMiddleware = require('../middleware/authMiddleware');

var _student = require('../model/student');

var _student2 = _interopRequireDefault(_student);

var _subject = require('../model/subject');

var _subject2 = _interopRequireDefault(_subject);

var _assignment = require('../model/assignment');

var _assignment2 = _interopRequireDefault(_assignment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var api = (0, _express.Router)();

    // '/subject/...' Create new subject
    api.post('/create/:studentId', _authMiddleware.authenticate, function (req, res) {
        _student2.default.findById(req.params.studentId, function (err, student) {
            if (err) {
                res.send(err + ' :err finding student by id');
            }
            var newSubject = new _subject2.default();
            newSubject.title = req.body.title;
            newSubject.description = req.body.description;
            newSubject.teacher = student.teacher;
            newSubject.term = student.term;
            newSubject.student = student._id;
            newSubject.save(function (err) {
                if (err) {
                    res.send(err + ' :err saving new subject');
                }
                student.subjects.push(newSubject);
                student.save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving subject to student');
                    }
                    res.json({ message: 'new subject saved' });
                });
            });
        });
    });

    // Get subjects by studentId
    api.get('/student/:studentId', function (req, res) {
        _subject2.default.find({ student: req.params.studentId }, function (err, subjects) {
            if (subjects === null) {
                res.json('subjects not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(subjects);
            }
        });
    });

    //Get subject by id
    api.get('/:subjectId', function (req, res) {
        _subject2.default.findById(req.params.subjectId, function (err, subject) {
            console.log(subject);
            if (subject === null) {
                res.json('subject not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(subject);
            }
        });
    });

    // Update subject basic info
    api.patch('/update/:subjectId', _authMiddleware.authenticate, function (req, res) {
        _subject2.default.findById(req.params.subjectId, function (err, subject) {
            if (err) {
                res.send(err);
            }
            if (req.body.title !== undefined) {
                subject.title = req.body.title;
            }
            if (req.body.description !== undefined) {
                subject.description = req.body.description;
            }

            subject.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'subject info updated successfully' });
            });
        });
    });

    // Delete subject
    api.delete('/remove/:subjectId', _authMiddleware.authenticate, function (req, res) {
        var id = req.params.subjectId;

        _subject2.default.findById(id, function (err, subject) {
            if (err) {
                res.send(err + ' :err finding subject by id');
            }
            _student2.default.find({ subjects: id }, function (err, student) {
                if (err) {
                    res.send(err + ' :err finding student by subjectId');
                }
                student[0].subjects.pull(subject);
                student[0].save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving student');
                    }
                });
            });
            _subject2.default.remove({ _id: req.params.subjectId }, function (err) {
                if (err) {
                    res.send(err + ' :err removing Subject');
                }
                _assignment2.default.remove({ subject: id }, function (err, assignment) {
                    if (err) {
                        res.send(err + ' :err removing assignment in subject');
                    }
                    if (assignment === null) {
                        res.status(404).send("assignment not found");
                    }
                });
            });
        });
        res.json({ message: "subject successfully removed" });
    });

    return api;
};
//# sourceMappingURL=subject.js.map