import express from 'express'
import config from '../config/config'
import middleware from '../middleware/middleware'
import initializeDb from '../db'

import Teacher from '../controller/teacher'
import SchoolTerm from '../controller/schoolTerm'
import Student from '../controller/student'
import Subject from '../controller/subject'
import Assignment from '../controller/assignment'


let router = express()

// connect to db
initializeDb(db => {

    //now connected to database
    // internal middleware
    router.use(middleware({config, db}))

    //api routes
    router.use('/teacher', Teacher({config, db}))
    router.use('/term', SchoolTerm({config, db}))
    router.use('/student', Student({config, db}))
    router.use('/subject', Subject({config, db}))
    router.use('/assignment', Assignment({config, db}))
})

export default router
