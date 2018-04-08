import {Router} from 'express'
import Teacher from '../model/teacher'
import SchoolTerm from '../model/schoolTerm'
import Student from '../model/student'
import Subject from '../model/subject'
import Assignment from '../model/assignment'
import { authenticate } from '../middleware/authMiddleware'

export default ({config, db}) => {
    let api = Router();

    // '/assignment/create/:assignment' - Create new assignment
    api.post('/create/:assignmentId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            SchoolTerm.findById(req.params.termId, (err, term) => {
                let newStudent = new Student();
                newTerm.termTitle = req.body.termTitle;
                newTerm.termStart = req.body.termStart;
                newTerm.termEnd = req.body.termEnd;
                newTerm.teacher = teacher._id;
                newTerm.save(err => {
                    if (err) {
                        res.send(err+' :err saving new term');
                    }
                    teacher.schoolTerms.push(newTerm);
                    teacher.save(err => {
                        if (err) {
                            res.send(err+' :err saving teacher');
                        }
                        res.json({message: 'New term saved'});
                    });
                });
            });

        })
    });

    return api;
}