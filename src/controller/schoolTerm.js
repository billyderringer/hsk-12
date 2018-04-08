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
        SchoolTerm.remove({_id: req.params.termId}, err => {
            if (err) {
                res.send(err);
            }
            let id = req.params.termId
            Teacher.find({terms: id}, (err, result) => {
                if (err) {
                    res.send(err+' :err finding term in teacher')
                }
                if (result === null) {
                    res.status(404).send("term not found")
                }
                else (
                    Teacher.remove({
                        terms: id
                    }, err => {
                        if (err) {
                            res.send(err + ' :err removing term')
                        }
                    })
                )
            })
            Student.find({teacher: id}, (err, result) => {
                if (err) {
                    res.send(err+' :err finding student in teacher')
                }
                if (result === null) {
                    res.status(404).send("student not found")
                }
                else (
                    Student.remove({
                        term: id
                    }, err => {
                        if (err) {
                            res.send(err + ' :err removing student')
                        }
                    })
                )
            })
            Subject.find({teacher: id}, (err, result) => {
                if (err) {
                    res.send(err+' :err finding subject in teacher')
                }
                if (result === null) {
                    res.status(404).send("subject not found")
                }
                else (
                    Subject.remove({
                        term: id
                    }, err => {
                        if (err) {
                            res.send(err + ' :err removing subject')
                        }
                    })
                )
            })
            Assignment.find({teacher: id}, (err, result) => {
                if (err) {
                    res.send(err+' :err finding assignment in teacher')
                }
                if (result === null) {
                    res.status(404).send("assignment not found")
                }
                else (
                    Assignment.remove({
                        term: id
                    }, err => {
                        if (err) {
                            res.send(err + ' :err removing assignment')
                        }
                    })
                )
            })
            res.json({message: "term successfully removed"});
        });
    });

    return api;
}