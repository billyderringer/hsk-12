import mongoose from 'mongoose';
import Assignment from './assignment';
let Schema = mongoose.Schema;

let SubjectSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, default: 'None'},
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

module.exports = mongoose.model('Subject', SubjectSchema);