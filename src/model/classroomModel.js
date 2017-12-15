import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let ClassroomSchema = new Schema({
    roomName: {
        type: String,
        required: true
    },
    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }],
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

module.exports = mongoose.model('Classroom', ClassroomSchema);