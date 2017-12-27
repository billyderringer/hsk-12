import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let SchoolSchema = new Schema({
    hubName: String,
    classRooms: [{
        type: Schema.ObjectId,
        ref: 'Classroom'
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

module.exports = mongoose.model('School', SchoolSchema);