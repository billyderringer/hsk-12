import mongoose from 'mongoose';
import SchoolTerm from './schoolTerm';
let Schema = mongoose.Schema;

let StudentSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradeLevel: Number
});

module.exports = mongoose.model('Student', StudentSchema);