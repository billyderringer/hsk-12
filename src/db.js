import mongoose from 'mongoose';
import config from './config/config'

export default callback => {
    let db = mongoose.connect(config.mongoUrl);
    callback(db);
}