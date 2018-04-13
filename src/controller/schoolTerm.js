import {Router} from 'express'
import Teacher from '../model/teacher'
import SchoolTerm from '../model/schoolTerm'
import Assignment from "../model/assignment"
import Student from "../model/student"
import Subject from "../model/subject"
import { authenticate } from '../middleware/authMiddleware'

export default () => {
    let api = Router()

    // '/term/...' - Create new term
    api.post('/create/:teacherId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            let newTerm = new SchoolTerm();
            newTerm.termTitle = req.body.termTitle;
            newTerm.termStart = req.body.termStart;
            newTerm.termEnd = req.body.termEnd;
            newTerm.teacher = teacher._id;
            newTerm.save(err => {
                if (err) {
                    res.send(err+' :err saving new term');
                }
                teacher.terms.push(newTerm);
                teacher.save(err => {
                    if (err) {
                        res.send(err+' :err saving term to teacher');
                    }
                    res.json({message: 'new term saved'});
                });
            });
        })
    })

    // Get terms by teacherId
    api.get('/teacher/:teacherId', (req, res) => {
        SchoolTerm.find({teacher: req.params.teacherId}, (err, terms) => {
            console.log(terms)
            if(terms === null){
                res.json('terms not found')
            }
            else if (err) {
                res.send(err)
            }
            else {
                res.json(terms)
            }
        })
    })

    // Get term by id
    api.get('/:termId', (req, res) => {
        SchoolTerm.findById(req.params.termId, (err, term) => {
            console.log(term)
            if(term === null){
                res.json('term not found')
            }
            else if (err) {
                res.send(err)
            }
            else {
                res.json(term)
            }
        })
    })

    // Update term basic info
    api.patch('/update/:termId', authenticate, (req, res) => {
        SchoolTerm.findById(req.params.termId, (err, term) => {
            if (err) {
                res.send(err)
            }
            if (req.body.termTitle !== undefined) {
                term.termTitle = req.body.termTitle
            }
            if (req.body.termStart !== undefined) {
                term.termStart = req.body.termStart
            }
            if (req.body.termEnd !== undefined) {
                term.termEnd = req.body.termEnd
            }

            term.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json({message: 'term info updated successfully'})
            })
        })
    })

    // Delete term
    api.delete('/remove/:termId', authenticate, (req, res) => {
        let id = req.params.termId

        SchoolTerm.findById(id, (err, term) => {
            console.log(term)
            if (err) {
                res.send(err + ' :err finding term by id')
            }
            Teacher.find({terms: id}, (err, teacher) => {
                if (err) {
                    res.send(err + ' :err finding teacher by termId')
                }
                teacher[0].terms.pull(term)
                teacher[0].save(err => {
                    if (err) {
                        res.send(err + ' :err saving teacher')
                    }
                })
            })
            SchoolTerm.remove({_id: req.params.termId}, err => {
                if (err) {
                    res.send(err + ' :err removing SchoolTerm')
                }
                Student.remove({term: id}, (err, student) => {
                    if (err) {
                        res.send(err+' :err removing student in term')
                    }
                    if (student === null) {
                        res.status(404).send("student not found")
                    }

                    Subject.remove({term: id}, (err, subject) => {
                        if (err) {
                            res.send(err+' :err removing subject in student')
                        }
                        if (subject === null) {
                            res.status(404).send("subject not found")
                        }

                        Assignment.remove({term: id}, (err, assignment) => {
                            if (err) {
                                res.send(err+' :err removing assignment in subject')
                            }
                            if (assignment === null) {
                                res.status(404).send("assignment not found")
                            }
                        })
                    })
                })
            })
        })
        res.json({message: "term successfully removed"})
    })

    return api
}