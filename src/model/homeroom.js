import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let HomeroomSchema = new Schema({
    roomName: {
        type: String,
        required: true
    },
    hub: [{
        type: Schema.ObjectId,
        ref: 'Hub'
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

module.exports = mongoose.model('Homeroom', HomeroomSchema);