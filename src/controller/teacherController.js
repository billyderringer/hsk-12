import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hubModel';
import Homeroom from '../model/homeroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();
    let teacherCount = 0;

    // '/teacher/create/:roomId' - Create new teachers
    api.post('/create/:roomId', (req, res) => {
        Homeroom.findById(req.params.roomId, (err, homeroom) => {
            if (err) {
                res.send(err);
            }
            let newTeacher = new Teacher();
            newTeacher.firstName = req.body.firstName;
            newTeacher.lastName = req.body.lastName;
            newTeacher.homerooms = req.params.roomId;
            newTeacher.hub = homeroom.hub;
            Hub.findById(newTeacher.hub, (err, hub) => {
                if(err){
                    res.send(err);
                }
                hub.teachers.push(newTeacher);
                hub.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            newTeacher.save((err, teacher) => {
                if (err) {
                    res.send(err);
                }
                homeroom.teachers.push(newTeacher);
                homeroom.save(err => {
                    if (err) {
                        res.send(err);
                    }
                });
                teacher.save(err => {
                    if (err) {
                        res.send(err);
                    }
                    teacherCount++;
                    res.json({message: 'Teacher: ' + newTeacher.firstName + ' ' + newTeacher.lastName + ' successfully added to ' + homeroom.roomName});
                });
            });
        });
    });

    // '/teacher/list' - Read all teachers
    api.get('/list', (req, res) => {
        Teacher.find({}, (err, teachers) => {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/teacher/list/:roomId' - Read all teachers by classId
    api.get('/list/:roomId', (req, res) => {
        let id = req.params.roomId;
        Teacher.find({homerooms: id}, (err, teachers) => {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/teacher/:teacherId/students' - Read students by teacherId
    api.get('/:teacherId/students', (req, res) => {
        let id = req.params.teacherId;
        Teacher.find({students: id}, (err, students) => {
            if (err) {
                res.send(err);
            }
            res.json(students);
        });
    });

    // '/teacher/:teacherId' - Read teacher by teacherId
    api.get('/:teacherId', (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            res.json(teacher);
        });
    });

    // '/teacher/update/:id' - Update teacher basic info
    api.patch('/update/:teacherId', (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            if(req.body.firstName !== undefined) {
                teacher.firstName = req.body.firstName;
            }
            if(req.body.lastName !== undefined) {
                teacher.lastName = req.body.lastName;
            }
            teacher.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: teacher.firstName + ' ' + teacher.lastName + ': Info updated successfully'});
            });
        });
    });

    // '/teacher/:teacherId/assign/:studentId' - Assign students to teacher
    api.patch('/:teacherId/assign/:studentId', (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if(err){
                res.send(err);
            }
            Student.findById(req.params.studentId, (err, student) => {
                if(err){
                    res.send(err);
                }
                teacher.students.push(student);
                teacher.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
                student.teachers.push(teacher);
                student.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            })
        })
    });

    // '/teacher/remove/:teacherId' - Delete teacher
    api.delete('/remove/:teacherId', (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            let name = teacher.firstName + ' ' + teacher.lastName;
            let id = teacher._id;
            Hub.find({homerooms: id}, (err, hub) => {
                if(err){
                    res.send(err);
                }
                hub.teachers.pull(teacher);
                hub.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            Homeroom.find({homerooms: id}, (err, homeroom) => {
                if(err){
                    res.send(err);
                }
                homeroom.teachers.pull(teacher);
                homeroom.save(err => {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            Teacher.remove(id, err => {
                if (err) {
                    res.send(err);
                }
                teacherCount--;
                res.json({message: name + ' successfully removed'});
            });
        });
    });

    return api;
}