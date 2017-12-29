import mongoose from 'mongoose';
import {Router} from 'express';
import School from '../model/hubModel';
import Classroom from '../model/homeroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();

    // '/classroom/teachers/add/:id' - Create new teachers
    api.post('/add/:id', (req, res) => {
        Hub.findById(req.params.id, (err, hub) => {
            if (err) {
                res.send(err);
            }
            let newTeacher = new Teacher();
            newTeacher.firstName = req.body.firstName;
            newTeacher.lastName = req.body.lastName;
            newTeacher.hub = hub._id;
            newTeacher.save((err, teacher) => {
                if (err) {
                    res.send(err);
                }
                hub.teachers.push(newTeacher);
                hub.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
                teacher.save(err => {
                    if (err) {
                        res.send(err);
                    }
                    res.json({message: 'Teacher successfully added to school'});
                });
            });
        });
    });

    // '/classroom/teachers/list' - Read all teachers
    api.get('/list', (req, res) => {
        Teacher.find({}, (err, teachers) => {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/classroom/teachers/:classId' - Read all teachers by classId
    /*api.get('/:classId', (req, res) => {
        Teacher.find({classrooms: req.params.classId}, (err, teachers) => {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });*/

    // '/classroom/teachers/:id' - Read teacher by id
    api.get('/', (req, res) => {
        Teacher.find({}, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            res.json(teacher);
        });
    });

    // '/classroom/teachers/update/:id' - Update
    api.put('/update/:id', (req, res) => {
        Teacher.findById(req.params.id, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            if (req.body.firstName !== undefined) {
                teacher.firstName = req.body.firstName;
            }
            if (req.body.lastName !== undefined) {
                teacher.lastName = req.body.lastName;
            }
            teacher.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: teacher.firstName + ' ' + teacher.lastName + '\'s info updated successfully'});
            });
        });
    });

    // '/classroom/teachers/remove/:id' - Delete
    api.delete('/remove/:id', (req, res) => {
        Teacher.findById(req.params.id, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            let id = teacher.classrooms;
            Classroom.findById(id, (err, classroom) => {
                classroom.teachers.pull(teacher);
                classroom.save(err => {
                    if (err) {
                        res.send(err);
                    }
                    Teacher.remove({
                        _id: req.params.id
                    }, (err, teacher) => {
                        if (err) {
                            res.send(err);
                        }
                        res.json({message: 'Teacher successfully removed'});
                    });
                });
            });
        });
    });

    return api;
}