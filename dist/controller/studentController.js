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

    // '/classroom/students/add/:id' - Create new students
    api.post('/add/:id', function (req, res) {
        _schoolModel2.default.findById(req.params.id, function (err, school) {
            if (err) {
                res.send(err);
            }
            var newStudent = new _studentModel2.default();
            newStudent.firstName = req.body.firstName;
            newStudent.lastName = req.body.lastName;
            newStudent.gradeLevel = req.body.gradeLevel;
            newStudent.gradingScale = req.body.gradingScale;
            newStudent.hub = hub._id;
            newStudent.save(function (err, student) {
                if (err) {
                    res.send(err);
                }
                hub.students.push(newStudent);
                hub.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                student.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: 'Student successfully saved to hub' });
                });
            });
        });
    });

    return api;
};
//# sourceMappingURL=student.js.map
//# sourceMappingURL=studentController.js.map