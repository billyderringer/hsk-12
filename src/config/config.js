//import authMiddleware from '../middleware/authMiddleware'

export default {
    "port": process.env.PORT || 8000,
    //for dev
    //"port": "8000",
    "mongoUrl": "mongodb://k12user:k12user@ds125912.mlab.com:25912/hsk-12",
    //for dev
    //"mongoUrl": "mongodb://localhost:27017/hsk-12-api",
    "bodyLimit": "100kb"
}