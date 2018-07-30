import {Router} from 'express'
import { authenticate } from '../middleware/authMiddleware'
import Subject from '../model/subject'
import Assignment from '../model/assignment'

export default () => {
    let api = Router()

    api.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*'])
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        res.append('Access-Control-Allow-Headers', 'Content-Type')
        next()
    })

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
            })
        })
    })

    // Get assignments by subjectId
    api.get('/subject/:subjectId', (req, res) => {
        Assignment.find({subject: req.params.subjectId}, (err, assignments) => {
            if(assignments === null){
                res.json('assignments not found')
            }
            else if (err) {
                res.send(err)
            }
            else {
                res.json(assignments)
            }
        })
    })

    //Get assignment by id
    api.get('/:assignmentId', (req, res) => {
        Assignment.findById(req.params.assignmentId, (err, assignment) => {
            console.log(assignment)
            if(assignment === null){
                res.json('assignment not found')
            }
            else if (err) {
                res.send(err);
            }
            else {
                res.json(assignment);
            }
        });
    })

    // Update assignment basic info
    api.patch('/update/:assignmentId', authenticate, (req, res) => {
        Assignment.findById(req.params.assignmentId, (err, assignment) => {
            if (err) {
                res.send(err)
            }
            if (req.body.title !== undefined) {
                assignment.title = req.body.title
            }
            if (req.body.description !== undefined) {
                assignment.description = req.body.description
            }
            if (req.body.assignmentType !== undefined) {
                assignment.assignmentType = req.body.assignmentType
            }
            if (req.body.correctAnswers !== undefined) {
                assignment.correctAnswers = req.body.correctAnswers
            }
            if (req.body.incorrectAnswers !== undefined) {
                assignment.incorrectAnswers = req.body.incorrectAnswers
            }
            if (req.body.grade !== undefined) {
                assignment.grade = req.body.grade
            }

            assignment.save(err => {
                if (err) {
                    res.send(err)
                }
                res.json({message: 'assignment info updated successfully'})
            })
        })
    })

    // Delete assignment
    api.delete('/remove/:assignmentId', authenticate, (req, res) => {
        let id = req.params.assignmentId

        Assignment.findById(id, (err, assignment) => {
            if (err) {
                res.send(err + ' :err finding assignment by id')
            }
            Subject.find({assignments: id}, (err, subject) => {
                if (err) {
                    res.send(err + ' :err finding subject by assignmentId')
                }
                subject[0].assignments.pull(assignment)
                subject[0].save(err => {
                    if (err) {
                        res.send(err + ' :err saving subject')
                    }
                })
            })
            Assignment.remove({_id: req.params.assignmentId}, err => {
                if (err) {
                    res.send(err + ' :err removing Assignment')
                }
            })
        })
        res.json({message: "assignment successfully removed"})
    })

    return api
}