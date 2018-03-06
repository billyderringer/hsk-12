import mongoose from 'mongoose';
let Schema = mongoose.Schema;
import SchoolTerm from './schoolTerm';
import Student from './student';
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
    schoolTerms: [{
        students: [{
            subjects: [{
                assignments: [{}]
            }]
        }]
    }]
});

Teacher.plugin(passportLocalMongoose);
module.exports = mongoose.model('Teacher', Teacher);