'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var DataSchema = new Schema({

    roomName: {
        type: String,
        required: true
    },
    hub: [{
        type: Schema.ObjectId,
        ref: 'Hub',
        hubName: Hub.hubName
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

module.exports = _mongoose2.default.model('Data', DataSchema);
//# sourceMappingURL=data.js.map