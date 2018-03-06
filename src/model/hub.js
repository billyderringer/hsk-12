import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let HubSchema = new Schema({
    hubName: String,
    teachers: [{
        type: Schema.ObjectId,
        ref: 'Teacher'
    }],
    students: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});

module.exports = mongoose.model('Hub', HubSchema);