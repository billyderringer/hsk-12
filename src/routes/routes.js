import express from 'express';
import config from '../config/config';
import middleware from '../middleware/middleware';
import initializeDb from '../db';
import Hub from '../controller/hubController';
import Homeroom from '../controller/homeroomController';
import Teacher from '../controller/teacherController';
import Student from '../controller/studentController';


let router = express();

// connect to db
initializeDb(db => {

    //now connected to database
    // internal middleware
    router.use(middleware({config, db}));

    //api routes
    router.use('/hub', Hub({config, db}));
    router.use('/homeroom', Homeroom({config, db}));
    router.use('/teacher', Teacher({config, db}));
    router.use('/student', Student({config, db}));
});

export default router;
