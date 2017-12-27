import express from 'express';
import config from '../config/config';
import middleware from '../middleware/middleware';
import initializeDb from '../db';
import School from '../controller/schoolController';
import Classroom from '../controller/classroomController';
import Teacher from '../controller/teacherController';
import Student from '../controller/studentController';


let router = express();

// connect to db
initializeDb(db => {

    //now connected to database
    // internal middleware
    router.use(middleware({config, db}));

    //api routes
    //router.use('/hub', School({config, db}));
    router.use('/hub', Classroom({config, db}));
    router.use('/teachers', Teacher({config, db}));
    router.use('/students', Student({config, db}));
});

export default router;
