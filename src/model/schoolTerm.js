import mongoose from 'mongoose';
import Student from './student';
let Schema = mongoose.Schema;

let SchoolTermSchema = new Schema({
    termTitle: {type: String, required: true},
    termStart: Date,
    termEnd: Date
});

module.exports = mongoose.model('SchoolTerm', SchoolTermSchema);