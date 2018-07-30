'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _authMiddleware = require('../middleware/authMiddleware');

var _subject = require('../model/subject');

var _subject2 = _interopRequireDefault(_subject);

var _assignment = require('../model/assignment');

var _assignment2 = _interopRequireDefault(_assignment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var api = (0, _express.Router)();

    api.use(function (req, res, next) {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    // '/assignment/...' Create new assignment
    api.post('/create/:subjectId', _authMiddleware.authenticate, function (req, res) {
        _subject2.default.findById(req.params.subjectId, function (err, subject) {
            if (err) {
                res.send(err + ' :err finding subject by id');
            }
            var newAssignment = new _assignment2.default();
            newAssignment.title = req.body.title;
            newAssignment.description = req.body.description;
            newAssignment.assignmentType = req.body.assignmentType;
            newAssignment.correctAnswers = req.body.correctAnswers;
            newAssignment.incorrectAnswers = req.body.incorrectAnswers;
            newAssignment.grade = req.body.grade;
            newAssignment.teacher = subject.teacher;
            newAssignment.term = subject.term;
            newAssignment.student = subject.student;
            newAssignment.subject = subject._id;
            newAssignment.save(function (err) {
                if (err) {
                    res.send(err + ' :err saving new subject');
                }
                subject.assignments.push(newAssignment);
                subject.save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving assignment to subject');
                    }
                    res.json({ message: 'new assignment saved' });
                });
            });
        });
    });

    // Get assignments by subjectId
    api.get('/subject/:subjectId', function (req, res) {
        _assignment2.default.find({ subject: req.params.subjectId }, function (err, assignments) {
            if (assignments === null) {
                res.json('assignments not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(assignments);
            }
        });
    });

    //Get assignment by id
    api.get('/:assignmentId', function (req, res) {
        _assignment2.default.findById(req.params.assignmentId, function (err, assignment) {
            console.log(assignment);
            if (assignment === null) {
                res.json('assignment not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(assignment);
            }
        });
    });

    // Update assignment basic info
    api.patch('/update/:assignmentId', _authMiddleware.authenticate, function (req, res) {
        _assignment2.default.findById(req.params.assignmentId, function (err, assignment) {
            if (err) {
                res.send(err);
            }
            if (req.body.title !== undefined) {
                assignment.title = req.body.title;
            }
            if (req.body.description !== undefined) {
                assignment.description = req.body.description;
            }
            if (req.body.assignmentType !== undefined) {
                assignment.assignmentType = req.body.assignmentType;
            }
            if (req.body.correctAnswers !== undefined) {
                assignment.correctAnswers = req.body.correctAnswers;
            }
            if (req.body.incorrectAnswers !== undefined) {
                assignment.incorrectAnswers = req.body.incorrectAnswers;
            }
            if (req.body.grade !== undefined) {
                assignment.grade = req.body.grade;
            }

            assignment.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'assignment info updated successfully' });
            });
        });
    });

    // Delete assignment
    api.delete('/remove/:assignmentId', _authMiddleware.authenticate, function (req, res) {
        var id = req.params.assignmentId;

        _assignment2.default.findById(id, function (err, assignment) {
            if (err) {
                res.send(err + ' :err finding assignment by id');
            }
            _subject2.default.find({ assignments: id }, function (err, subject) {
                if (err) {
                    res.send(err + ' :err finding subject by assignmentId');
                }
                subject[0].assignments.pull(assignment);
                subject[0].save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving subject');
                    }
                });
            });
            _assignment2.default.remove({ _id: req.params.assignmentId }, function (err) {
                if (err) {
                    res.send(err + ' :err removing Assignment');
                }
            });
        });
        res.json({ message: "assignment successfully removed" });
    });

    return api;
};
//# sourceMappingURL=assignment.js.map