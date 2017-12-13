import express from 'express';
import config from '../config/config';
import middleware from '../middleware/middleware';
import initializeDb from '../db';
import School from '../controller/schoolController';

let router = express();

// connect to db
initializeDb(db => {
    //now connected to database
    // internal middleware
    router.use(middleware({config, db}));

    //api routes v1 (/v1)
    router.use('/school', School({config, db}));
});

export default router;
