import {Router} from 'express'
import Teacher from '../model/teacher'
import SchoolTerm from '../model/schoolTerm'
import Student from '../model/student'
import Subject from '../model/subject'
import Assignment from '../model/assignment'
import { authenticate } from '../middleware/authMiddleware'

export default ({config, db}) => {
    let api = Router();

    // '/subject/...' Create new subject
    api.post('/create/:teacherId/:termId/:studentId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            SchoolTerm.findById(req.params.termId, (err,term) => {
                if(err){
                    res.send(err+' :err finding term by id')
                }
                Student.findById(req.params.studentId, (err, student) => {
                    if(err){
                        res.send(err+' :err finding student by id')
                    }
                    let newSubject = new Subject()
                    newSubject.title = req.body.title
                    newSubject.description = req.body.description
                    newSubject.teacher = teacher._id
                    newSubject.term = term._id
                    newSubject.student = student._id
                    newSubject.save(err => {
                        if (err) {
                            res.send(err+' :err saving new subject')
                        }
                        teacher.subjects.push(newSubject)
                        teacher.save(err => {
                            if (err) {
                                res.send(err+' :err saving subject to teacher')
                            }
                        });
                        term.subjects.push(newSubject)
                        term.save(err=> {
                            if(err){
                                res.send(err+' :err saving subject to term')
                            }
                        })
                        student.subjects.push(newSubject)
                        student.save(err => {
                            if(err){
                                res.send(err+' :err saving subject to student')
                            }
                            res.json({message: 'new subject saved'})
                        })
                    });
                });
            })

        })
    });

    return api;
}