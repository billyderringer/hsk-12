'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _authMiddleware = require('../middleware/authMiddleware');

var _teacher = require('../model/teacher');

var _teacher2 = _interopRequireDefault(_teacher);

var _schoolTerm = require('../model/schoolTerm');

var _schoolTerm2 = _interopRequireDefault(_schoolTerm);

var _assignment = require('../model/assignment');

var _assignment2 = _interopRequireDefault(_assignment);

var _student = require('../model/student');

var _student2 = _interopRequireDefault(_student);

var _subject = require('../model/subject');

var _subject2 = _interopRequireDefault(_subject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var api = (0, _express.Router)();

    // '/term/...' - Create new term
    api.post('/create/:teacherId', _authMiddleware.authenticate, function (req, res) {
        _teacher2.default.findById(req.params.teacherId, function (err, teacher) {
            if (err) {
                res.send(err);
            }
            var newTerm = new _schoolTerm2.default();
            newTerm.termTitle = req.body.termTitle;
            newTerm.termStart = req.body.termStart;
            newTerm.termEnd = req.body.termEnd;
            newTerm.teacher = teacher._id;
            newTerm.save(function (err) {
                if (err) {
                    res.send(err + ' :err saving new term');
                }
                teacher.terms.push(newTerm);
                teacher.save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving term to teacher');
                    }
                    res.json({ message: 'new term saved' });
                });
            });
        });
    });

    // Get terms by teacherId
    api.get('/teacher/:teacherId', function (req, res) {
        _schoolTerm2.default.find({ teacher: req.params.teacherId }, function (err, terms) {
            if (terms === null) {
                res.json('terms not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(terms);
            }
        });
    });

    // Get term by id
    api.get('/:termId', function (req, res) {
        _schoolTerm2.default.findById(req.params.termId, function (err, term) {
            if (term === null) {
                res.json('term not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(term);
            }
        });
    });

    // Update term basic info
    api.patch('/update/:termId', _authMiddleware.authenticate, function (req, res) {
        _schoolTerm2.default.findById(req.params.termId, function (err, term) {
            if (err) {
                res.send(err);
            }
            if (req.body.termTitle !== undefined) {
                term.termTitle = req.body.termTitle;
            }
            if (req.body.termStart !== undefined) {
                term.termStart = req.body.termStart;
            }
            if (req.body.termEnd !== undefined) {
                term.termEnd = req.body.termEnd;
            }

            term.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'term info updated successfully' });
            });
        });
    });

    // Delete term
    api.delete('/remove/:termId', _authMiddleware.authenticate, function (req, res) {
        var id = req.params.termId;

        _schoolTerm2.default.findById(id, function (err, term) {
            if (err) {
                res.send(err + ' :err finding term by id');
            }
            _teacher2.default.find({ terms: id }, function (err, teacher) {
                if (err) {
                    res.send(err + ' :err finding teacher by termId');
                }
                teacher[0].terms.pull(term);
                teacher[0].save(function (err) {
                    if (err) {
                        res.send(err + ' :err saving teacher');
                    }
                });
            });
            _schoolTerm2.default.remove({ _id: req.params.termId }, function (err) {
                if (err) {
                    res.send(err + ' :err removing SchoolTerm');
                }
                _student2.default.remove({ term: id }, function (err, student) {
                    if (err) {
                        res.send(err + ' :err removing student in term');
                    }
                    if (student === null) {
                        res.status(404).send("student not found");
                    }

                    _subject2.default.remove({ term: id }, function (err, subject) {
                        if (err) {
                            res.send(err + ' :err removing subject in student');
                        }
                        if (subject === null) {
                            res.status(404).send("subject not found");
                        }

                        _assignment2.default.remove({ term: id }, function (err, assignment) {
                            if (err) {
                                res.send(err + ' :err removing assignment in subject');
                            }
                            if (assignment === null) {
                                res.status(404).send("assignment not found");
                            }
                        });
                    });
                });
            });
        });
        res.json({ message: "term successfully removed" });
    });

    return api;
};
//# sourceMappingURL=schoolTerm.js.map