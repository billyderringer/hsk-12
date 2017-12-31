import mongoose from 'mongoose';
import config from './config/config'

export default callback => {
    mongoose.Promise = global.Promise;
    let db = mongoose.connect(config.mongoUrl);
    callback(db);
}