"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var ProfileSchema = new Schema({
    location: {
        type: String,
        default: "None"
    },
    description: {
        type: String,
        default: "None"
    },
    profilePic: {
        type: String,
        default: "default-profile.png"
    }
});

var TeacherSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userProfile: [ProfileSchema],
    hub: {
        type: Schema.ObjectId,
        ref: 'Hub'
    },
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
    }]
});

module.exports = _mongoose2.default.model('Teacher', TeacherSchema);
//# sourceMappingURL=teacher.js.map