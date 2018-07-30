'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var SubjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: 'None' },
    teacher: {
        type: Schema.ObjectId,
        ref: 'Teacher'
    },
    term: {
        type: Schema.ObjectId,
        ref: 'SchoolTerm'
    },
    student: {
        type: Schema.ObjectId,
        ref: 'Student'
    },
    assignments: [{
        type: Schema.ObjectId,
        ref: 'Assignment'
    }]
});

//fixes the pushAll error
_mongoose2.default.plugin(function (schema) {
    schema.options.usePushEach = true;
});

module.exports = _mongoose2.default.model('Subject', SubjectSchema, 'Subject');
//# sourceMappingURL=subject.js.map