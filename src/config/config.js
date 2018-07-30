import authMiddleware from '../middleware/authMiddleware'

export default {
    "port": "https://hsk-12.herokuapp.com",
    "mongoUrl": "mongodb://" +
        authMiddleware.username + ":" +
        authMiddleware.password +
        "@@ds031903.mlab.com:31903/heroku_t5267h8q",
    "bodyLimit": "100kb"
}