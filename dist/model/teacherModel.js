'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var TeacherSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    school: {
        type: Schema.ObjectId,
        ref: 'School'
    },
    classrooms: [{
        type: Schema.ObjectId,
        ref: 'Classroom'
    }],
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

module.exports = _mongoose2.default.model('Teacher', TeacherSchema);
//# sourceMappingURL=teacherModel.js.map