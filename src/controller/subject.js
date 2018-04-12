import {Router} from 'express'
import Student from '../model/student'
import Subject from '../model/subject'
import { authenticate } from '../middleware/authMiddleware'

export default ({config, db}) => {
    let api = Router();

    // '/subject/...' Create new subject
    api.post('/create/:studentId', authenticate, (req, res) => {
                Student.findById(req.params.studentId, (err, student) => {
                    if(err){
                        res.send(err+' :err finding student by id')
                    }
                    let newSubject = new Subject()
                    newSubject.title = req.body.title
                    newSubject.description = req.body.description
                    newSubject.teacher = student.teacher
                    newSubject.term = student.term
                    newSubject.student = student._id
                    newSubject.save(err => {
                        if (err) {
                            res.send(err+' :err saving new subject')
                        }
                        student.subjects.push(newSubject)
                        student.save(err => {
                            if(err){
                                res.send(err+' :err saving subject to student')
                            }
                            res.json({message: 'new subject saved'})
                        })
                    });
                });
    });

    return api;
}