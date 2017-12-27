'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var StudentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gradeLevel: Number,
    gradingScale: String,
    school: {
        type: Schema.ObjectId,
        ref: 'School'
    },
    classRooms: [{
        type: Schema.ObjectId,
        ref: 'Classroom'
    }],
    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }]
});

module.exports = _mongoose2.default.model('Student', StudentSchema);
//# sourceMappingURL=studentModel.js.map