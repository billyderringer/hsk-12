import express from 'express';
import config from '../config/config';
import middleware from '../middleware/middleware';
import initializeDb from '../db';
import Classroom from '../controller/classroomController';
import Teacher from '../controller/teacherController';

let router = express();

// connect to db
initializeDb(db => {
    //now connected to database
    // internal middleware
    router.use(middleware({config, db}));

    //api routes v1 (/v1)
    router.use('/classroom', Classroom({config, db}));
    router.use('/classroom/teachers', Teacher({config, db}));
});

export default router;
