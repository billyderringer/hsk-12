import {Router} from 'express'
import Subject from '../model/subject'
import Assignment from '../model/assignment'
import { authenticate } from '../middleware/authMiddleware'

export default ({config, db}) => {
    let api = Router();

    // '/assignment/...' Create new assignment
    api.post('/create/:subjectId', authenticate, (req, res) => {
        Subject.findById(req.params.subjectId, (err, subject) => {
            if(err){
                res.send(err+' :err finding subject by id')
            }
            let newAssignment = new Assignment()
            newAssignment.title = req.body.title
            newAssignment.description = req.body.description
            newAssignment.assignmentType = req.body.assignmentType
            newAssignment.correctAnswers = req.body.correctAnswers
            newAssignment.incorrectAnswers = req.body.incorrectAnswers
            newAssignment.grade = req.body.grade
            newAssignment.teacher = subject.teacher
            newAssignment.term = subject.term
            newAssignment.student = subject.student
            newAssignment.subject = subject._id
            newAssignment.save(err => {
                if (err) {
                    res.send(err+' :err saving new subject')
                }
                subject.assignments.push(newAssignment)
                subject.save(err => {
                    if(err){
                        res.send(err+' :err saving assignment to subject')
                    }
                    res.json({message: 'new assignment saved'})
                })
            });
        });
    });

    return api;
}