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
    hub: {
        type: Schema.ObjectId,
        ref: 'Hub',
    },
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
    }],
    subjects: [{
        type: Schema.ObjectId,
        ref: 'Subject'
    }],
    assignments: [{
        type: Schema.ObjectId,
        ref: 'Assignment'
    }]
});

module.exports = mongoose.model('Student', StudentSchema);