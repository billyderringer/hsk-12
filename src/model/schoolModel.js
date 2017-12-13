import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let SchoolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    principalName: String
});

module.exports = mongoose.model('School', SchoolSchema);