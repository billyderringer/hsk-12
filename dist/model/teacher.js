'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passportLocalMongoose = require('passport-local-mongoose');

var _passportLocalMongoose2 = _interopRequireDefault(_passportLocalMongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var Teacher = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: String,
    password: String,
    streetAddress: { type: String, default: "None" },
    usState: { type: String, default: "None" },
    zipCode: { type: String, default: "None" },
    phonePrimary: { type: String, default: "None" },
    phoneSecondary: { type: String, default: "None" },
    personalDescription: { type: String, default: "None" },
    avatar: { type: String, default: "default-profile.png" },
    homeroomName: { type: String, default: "Homeroom" },
    terms: [{
        type: Schema.ObjectId,
        ref: 'SchoolTerm'
    }]
});

//fixes the pushAll error
_mongoose2.default.plugin(function (schema) {
    schema.options.usePushEach = true;
});

//needed for authentication
Teacher.plugin(_passportLocalMongoose2.default);

module.exports = _mongoose2.default.model('Teacher', Teacher, 'Teacher');
//# sourceMappingURL=teacher.js.map