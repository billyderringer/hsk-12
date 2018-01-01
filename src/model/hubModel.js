import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let HubSchema = new Schema({
    hubName: String,
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
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

module.exports = mongoose.model('Hub', HubSchema);