import {Router} from 'express';
import Teacher from '../model/teacher';
import SchoolTerm from '../model/schoolTerm';
import { authenticate } from '../middleware/authMiddleware';
import Assignment from "../model/assignment";
import Student from "../model/student";
import Subject from "../model/subject";

export default ({config, db}) => {
    let api = Router();

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
    });

    // Delete term
    api.delete('/remove/:termId', authenticate, (req, res) => {
        SchoolTerm.find({_id: req.params.termId}, (err,term) => {
            if (err) {
                res.send(err+' :err finding term by id')
            }
            let id = req.params.termId
            Student.find({term: id}, (err, student) => {
                if (err) {
                    res.send(err+' :err finding student in term')
                }
                if (student === null) {
                    res.status(404).send("student not found")
                }
                Subject.find({term: id}, (err, subject) => {
                    if (err) {
                        res.send(err+' :err finding subject in student')
                    }
                    if (subject === null) {
                        res.status(404).send("subject not found")
                    }
                    Assignment.find({term: id}, (err, assignment) => {
                        if (err) {
                            res.send(err+' :err finding assignment in subject')
                        }
                        if (assignment === null) {
                            res.status(404).send("assignment not found")
                        }
                        Teacher.find({terms: req.params.termId}, (err, teacher) => {
                            if (err) {
                                res.send(err + ' :err finding teacher by termId')
                            }
                            teacher.terms.pull(term)
                            teacher.save(err => {
                                if (err) {
                                    res.send(err + ' :err saving pull from teacher');
                                }
                            })
                        })
                    }).remove( err => {
                        if (err) {
                            res.send(err+' :err removing assignment')
                        }
                    })
                }).remove( err => {
                    if (err) {
                        res.send(err+' :err removing subject')
                    }
                })
            }).remove( err => {
                if (err) {
                    res.send(err+' :err removing student')
                }
            })
        }).remove( err => {
            if (err) {
                res.send(err + ' :err removing term')
            }
        })
        res.json({message: "term successfully removed"})
    })

    return api;
}