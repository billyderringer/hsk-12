'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var Schema = _mongoose2.default.Schema;

var HubSchema = new Schema({
    hubName: String,
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
    }],
    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }],
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

module.exports = _mongoose2.default.model('Hub', HubSchema);
//# sourceMappingURL=hub.js.map
//# sourceMappingURL=hub.js.map