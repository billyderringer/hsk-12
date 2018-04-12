import {Router} from 'express'
import Teacher from '../model/teacher'
import SchoolTerm from '../model/schoolTerm'
import Student from '../model/student'
import { authenticate } from '../middleware/authMiddleware'

export default ({config, db}) => {
    let api = Router()

    // '/student/...' - Create new student
    api.post('/create/:termId', authenticate, (req, res) => {
            SchoolTerm.findById(req.params.termId, (err, term) => {
                if(err){
                    res.send(err+' :err finding term by id')
                }
                let newStudent = new Student();
                newStudent.firstName = req.body.firstName
                newStudent.lastName = req.body.lastName
                newStudent.gradeLevel = req.body.gradeLevel
                newStudent.teacher = term.teacher
                newStudent.term = term._id
                newStudent.save(err => {
                    if (err) {
                        res.send(err+' :err saving new student')
                    }
                    term.students.push(newStudent)
                    term.save(err => {
                        if(err){
                            res.send(err+' :err saving student to term')
                        }
                        res.json({message: 'new student saved'})
                    })
                });
            });
    });

    return api;
}