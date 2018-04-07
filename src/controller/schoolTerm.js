import {Router} from 'express';
import Teacher from '../model/teacher';
import SchoolTerm from '../model/schoolTerm';
import Student from '../model/student';
import Subject from '../model/subject';
import Assignment from '../model/assignment';
import passport from 'passport';
import config from '../config/config';
import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({config, db}) => {
    let api = Router();

    // '/term/create/:teacherId' - Create new term
    api.post('/term/create/:teacherId', authenticate, (req, res) => {
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
                teacher.schoolTerms.push(newTerm);
                teacher.save(err => {
                    if (err) {
                        res.send(err+' :err saving teacher');
                    }
                    res.json({message: 'New term saved'});
                });
            });
        })
    });

    return api;
}