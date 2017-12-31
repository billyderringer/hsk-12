import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let HubSchema = new Schema({
    hubName: String,
});

module.exports = mongoose.model('Hub', HubSchema);