import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let ProfileSchema = new Schema({
    location: {
        type: String,
        default: "None"
    },
    description: {
        type: String,
        default: "None"
    },
    profilePic: {
        type: String,
        default: "default-profile.png"
    }
});

let TeacherSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userProfile: [
        ProfileSchema
    ],
    hub: {
        type: Schema.ObjectId,
        ref: 'Hub',
    },
    homerooms: [{
        type: Schema.ObjectId,
        ref: 'Homeroom'
    }]
});

module.exports = mongoose.model('Teacher', TeacherSchema);