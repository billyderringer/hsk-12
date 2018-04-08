import mongoose from 'mongoose';
let Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

let Teacher = new Schema({
    firstName: {type: String,required: true},
    lastName: {type: String,required: true},
    email: String,
    password: String,
    streetAddress: {type: String,default: "None"},
    usState: {type: String,default: "None"},
    zipCode: {type: String,default: "None"},
    phonePrimary: {type: String,default: "None"},
    phoneSecondary: {type: String,default: "None"},
    personalDescription: {type: String,default: "None"},
    avatar: {type: String,default: "default-profile.png"},
    homeroomName: {type: String,default: "Homeroom"},
    terms: [{
        type: Schema.ObjectId,
        ref:'SchoolTerm'
    }],
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
        ref:'Assignment'
    }]
});

mongoose.plugin(schema => { schema.options.usePushEach = true });
Teacher.plugin(passportLocalMongoose);
module.exports = mongoose.model('Teacher', Teacher);