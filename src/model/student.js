import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let StudentSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradeLevel: Number,
    teacher: {
        type: Schema.ObjectId,
        ref: 'Teacher'
    },
    term: {
        type: Schema.ObjectId,
        ref: 'SchoolTerm'
    },
    subjects: [{
        type: Schema.ObjectId,
        ref:'Subject'
    }]
});

module.exports = mongoose.model('Student', StudentSchema);