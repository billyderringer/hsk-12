'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var SchoolTermSchema = new Schema({
    termTitle: String,
    termStart: Date,
    termEnd: Date,
    teacher: {
        type: Schema.ObjectId,
        ref: 'Teacher'
    },
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

//fixes the pushAll error
_mongoose2.default.plugin(function (schema) {
    schema.options.usePushEach = true;
});

module.exports = _mongoose2.default.model('SchoolTerm', SchoolTermSchema, 'SchoolTerm');
//# sourceMappingURL=schoolTerm.js.map