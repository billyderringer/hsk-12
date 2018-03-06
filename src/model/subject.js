import mongoose from 'mongoose';
import Assignment from './assignment';
let Schema = mongoose.Schema;

let SubjectSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, default: 'None'},
    gradeScale: {type: String, default: 'General'}
});

module.exports = mongoose.model('Subject', SubjectSchema);