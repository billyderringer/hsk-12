'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _authMiddleware = require('../middleware/authMiddleware');

var _teacher = require('../model/teacher');

var _teacher2 = _interopRequireDefault(_teacher);

var _schoolTerm = require('../model/schoolTerm');

var _schoolTerm2 = _interopRequireDefault(_schoolTerm);

var _student = require('../model/student');

var _student2 = _interopRequireDefault(_student);

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

    // '/teacher/...' - Register new account
    api.post('/register', function (req, res) {
        _teacher2.default.register(new _teacher2.default({
            username: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }), req.body.password, function (err) {
            if (err) {
                console.log(err);
                res.status(401).send('unauthorized');
            }
            _passport2.default.authenticate('local', {
                session: false
            })(req, res, function () {
                res.status(200).send('Successfully created new account');
            });
        });
    });

    // Login
    api.post('/login', _passport2.default.authenticate('local', {
        session: false,
        scope: []
    }), _authMiddleware.generateAccessToken, _authMiddleware.respond);

    // Logout
    api.get('/logout', _authMiddleware.authenticate, function (req, res) {
        res.logout();
        res.status(200).send('Successfully logged out');
    });

    // Get info about account
    api.get('/me', _authMiddleware.authenticate, function (req, res) {
        res.status(200).json(req.user);
    });

    // Get teacher by teacherId
    api.get('/:teacherId', _authMiddleware.authenticate, function (req, res) {
        _teacher2.default.findById(req.params.teacherId, function (err, teacher) {
            if (teacher === null) {
                res.json('teacher not found');
            } else if (err) {
                res.send(err);
            } else {
                res.json(teacher);
            }
        });
    });

    // Update teacher basic info
    // email will be unchangeable as it will be username
    api.patch('/update/:teacherId', _authMiddleware.authenticate, function (req, res) {
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
            if (req.body.password !== undefined) {
                teacher.password = req.body.password;
            }
            if (req.body.streetAddress !== undefined) {
                teacher.streetAddress = req.body.streetAddress;
            }
            if (req.body.usState !== undefined) {
                teacher.usState = req.body.usState;
            }
            if (req.body.zipCode !== undefined) {
                teacher.zipCode = req.body.zipCode;
            }
            if (req.body.phonePrimary !== undefined) {
                teacher.phonePrimary = req.body.phonePrimary;
            }
            if (req.body.phoneSecondary !== undefined) {
                teacher.phoneSecondary = req.body.phoneSecondary;
            }
            if (req.body.personalDescription !== undefined) {
                teacher.personalDescription = req.body.personalDescription;
            }
            if (req.body.avatar !== undefined) {
                teacher.avatar = req.body.avatar;
            }
            if (req.body.homeroomName !== undefined) {
                teacher.homeroomName = req.body.homeroomName;
            }

            teacher.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'teacher info updated successfully' });
            });
        });
    });

    // Delete teacher
    api.delete('/remove/:teacherId', _authMiddleware.authenticate, function (req, res) {
        _teacher2.default.find({ _id: req.params.teacherId }, function (err) {
            if (err) {
                res.send(err + ' :err finding teacher by id');
            }
            var id = req.params.teacherId;
            _schoolTerm2.default.find({ teacher: id }, function (err, term) {
                if (err) {
                    res.send(err + ' :err finding term in teacher');
                }
                if (term === null) {
                    res.status(404).send("term not found");
                }
                _student2.default.find({ teacher: id }, function (err, student) {
                    if (err) {
                        res.send(err + ' :err finding student in term');
                    }
                    if (student === null) {
                        res.status(404).send("student not found");
                    }
                    _subject2.default.find({ teacher: id }, function (err, subject) {
                        if (err) {
                            res.send(err + ' :err finding subject in student');
                        }
                        if (subject === null) {
                            res.status(404).send("subject not found");
                        }
                        _assignment2.default.find({ teacher: id }, function (err, assignment) {
                            if (err) {
                                res.send(err + ' :err finding assignment in subject');
                            }
                            if (assignment === null) {
                                res.status(404).send("assignment not found");
                            }
                        }).remove(function (err) {
                            if (err) {
                                res.send(err + ' :err removing assignment');
                            }
                        });
                    }).remove(function (err) {
                        if (err) {
                            res.send(err + ' :err removing subject');
                        }
                    });
                }).remove(function (err) {
                    if (err) {
                        res.send(err + ' :err removing student');
                    }
                });
            }).remove(function (err) {
                if (err) {
                    res.send(err + ' :err removing term');
                }
            });
        }).remove(function (err) {
            if (err) {
                res.send(err + ' :err removing teacher');
            }
        });
        res.json({ message: "teacher successfully removed" });
    });

    return api;
};
//# sourceMappingURL=teacher.js.map