import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let SchoolTermSchema = new Schema({
    termTitle: String,
    termStart: Date,
    termEnd: Date,
    teacher: {
        type: Schema.ObjectId,
        ref:'Teacher'
    },
    students: [{
        type: Schema.ObjectId,
        ref:'Student'
    }],
    subjects: [{
        type: Schema.ObjectId,
        ref:'Subject'
    }],
    assignments: [{
        type: Schema.ObjectId,
        ref: 'Assignment'
    }]
});

mongoose.plugin(schema => { schema.options.usePushEach = true });
module.exports = mongoose.model('SchoolTerm', SchoolTermSchema);