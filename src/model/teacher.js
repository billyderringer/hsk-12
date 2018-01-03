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
    hub: {
        type: Schema.ObjectId,
        ref: 'Hub',
    },
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
    }],
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);