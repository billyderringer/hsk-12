import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let TeacherSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    classrooms: {
        type: Schema.ObjectId,
        ref: 'Classroom'
    },
    students: {
        type: Schema.ObjectId,
        ref: 'Student'
    }
});

module.exports = mongoose.model('Teacher', TeacherSchema);