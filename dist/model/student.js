'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var StudentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gradeLevel: Number,
    teacher: {
        type: Schema.ObjectId,
        ref: 'Teacher'
    },
    term: {
        type: Schema.ObjectId,
        ref: 'SchoolTerm'
    },
    subjects: [{
        type: Schema.ObjectId,
        ref: 'Subject'
    }]
});

//fixes the pushAll error
_mongoose2.default.plugin(function (schema) {
    schema.options.usePushEach = true;
});

module.exports = _mongoose2.default.model('Student', StudentSchema, 'Student');
//# sourceMappingURL=student.js.map