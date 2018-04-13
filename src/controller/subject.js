import {Router} from 'express'
import Student from '../model/student'
import Subject from '../model/subject'
import { authenticate } from '../middleware/authMiddleware'
import Assignment from "../model/assignment";
import SchoolTerm from "../model/schoolTerm";

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

    //Get subject by id
    api.get('/:subjectId', (req, res) => {
        Subject.findById(req.params.subjectId, (err, subject) => {
            console.log(subject)
            if(subject === null){
                res.json('subject not found')
            }
            else if (err) {
                res.send(err);
            }
            else {
                res.json(subject);
            }
        });
    });

    // Delete subject
    api.delete('/remove/:subjectId', authenticate, (req, res) => {
        let id = req.params.subjectId

        Subject.findById(id, (err, subject) => {
            console.log(subject)
            if (err) {
                res.send(err + ' :err finding subject by id')
            }
            Student.find({subjects: id}, (err, student) => {
                if (err) {
                    res.send(err + ' :err finding student by subjectId')
                }
                student[0].subjects.pull(subject)
                student[0].save(err => {
                    if (err) {
                        res.send(err + ' :err saving student')
                    }
                })
            })
            Subject.remove({_id: req.params.subjectId}, err => {
                if (err) {
                    res.send(err + ' :err removing Subject')
                }
                Assignment.remove({subject: id}, (err, assignment) => {
                    if (err) {
                        res.send(err+' :err removing assignment in subject')
                    }
                    if (assignment === null) {
                        res.status(404).send("assignment not found")
                    }
                })
            })
        })
        res.json({message: "subject successfully removed"})
    })

    return api;
}