import {Router} from 'express';
import Teacher from '../model/teacher';
import SchoolTerm from '../model/schoolTerm';
import { authenticate } from '../middleware/authMiddleware';

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

    return api;
}