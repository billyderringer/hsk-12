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
    grade: String,
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