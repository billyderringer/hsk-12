import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let StudentSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gradeLevel: Number,
    gradingScale: String,
    school: {
        type: Schema.ObjectId,
        ref: 'School'
    },
    classRooms: [{
        type: Schema.ObjectId,
        ref: 'Classroom'
    }],
    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }]
});

module.exports = mongoose.model('Student', StudentSchema);