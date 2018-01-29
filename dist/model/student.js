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
    hub: {
        type: Schema.ObjectId,
        ref: 'Hub'
    },
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
    }],
    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }],
    subjects: [{
        type: Schema.ObjectId,
        ref: 'Subject'
    }],
    assignments: [{
        type: Schema.ObjectId,
        ref: 'Assignment'
    }]
});

module.exports = _mongoose2.default.model('Student', StudentSchema);
//# sourceMappingURL=student.js.map