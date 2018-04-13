import {Router} from 'express'
import SchoolTerm from '../model/schoolTerm'
import Student from '../model/student'
import { authenticate } from '../middleware/authMiddleware'
import Assignment from "../model/assignment";
import Subject from "../model/subject";

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
    })

    // Update student basic info
    api.patch('/update/:studentId', authenticate, (req, res) => {
        Student.findById(req.params.studentId, (err, student) => {
            if (err) {
                res.send(err)
            }
            if (req.body.firstName !== undefined) {
                student.firstName = req.body.firstName
            }
            if (req.body.lastName !== undefined) {
                student.lastName = req.body.lastName
            }
            if (req.body.gradeLevel !== undefined) {
                student.gradeLevel = req.body.gradeLevel
            }

            student.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json({message: 'student info updated successfully'})
            })
        })
    })

    //Get student by id
    api.get('/:studentId', (req, res) => {
        Student.findById(req.params.studentId, (err, student) => {
            console.log(student)
            if(student === null){
                res.json('student not found')
            }
            else if (err) {
                res.send(err);
            }
            else {
                res.json(student);
            }
        });
    })

    // Delete student
    api.delete('/remove/:studentId', authenticate, (req, res) => {
        let id = req.params.studentId

        Student.findById(id, (err, student) => {
            console.log(student)
            if (err) {
                res.send(err + ' :err finding student by id')
            }
            SchoolTerm.find({students: id}, (err, term) => {
                if (err) {
                    res.send(err + ' :err finding term by studentId')
                }
                term[0].students.pull(student)
                term[0].save(err => {
                    if (err) {
                        res.send(err + ' :err saving term')
                    }
                })
            })
            Student.remove({_id: req.params.studentId}, err => {
                if (err) {
                    res.send(err + ' :err removing Student')
                }
                Subject.remove({student: id}, (err, subject) => {
                    if (err) {
                        res.send(err+' :err removing subject in student')
                    }
                    if (subject === null) {
                        res.status(404).send("subject not found")
                    }

                    Assignment.remove({student: id}, (err, assignment) => {
                        if (err) {
                            res.send(err+' :err removing assignment in student')
                        }
                        if (assignment === null) {
                            res.status(404).send("assignment not found")
                        }
                    })
                })
            })
        })
        res.json({message: "student successfully removed"})
    })

    return api
}