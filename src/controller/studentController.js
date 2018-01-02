import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hubModel';
import Homeroom from '../model/homeroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();

    // '/student/create/:roomId' - Create new students
    api.post('/create/:roomId', (req, res) => {
        Homeroom.findById(req.params.roomId, (err, homeroom) => {
            if(err){
                res.send(err);
            }
            let newStudent = new Student();
            newStudent.firstName = req.body.firstName;
            newStudent.lastName = req.body.lastName;
            newStudent.gradeLevel = req.body.gradeLevel;
            newStudent.homerooms = homeroom._id;
            newStudent.hub = homeroom.hub;
            const name = newStudent.firstName + ' ' + newStudent.lastName;
            Hub.findById(newStudent.hub, (err, hub) => {
                if(err){
                    res.send(err);
                }
                hub.students.push(newStudent);
                hub.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            newStudent.save((err, student) => {
                if(err){
                    res.send(err);
                }
                homeroom.students.push(newStudent);
                homeroom.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
                student.save(err => {
                    if(err){
                        res.send(err);
                    }
                    res.json({message: 'Student: ' + name + ' successfully saved to ' + homeroom.roomName});
                });
            });

        });
    });

    // '/student/list' - Read all students
    api.get('/list', (req, res) => {
        Student.find({}, (err, students) => {
            if(err){
                res.send(err);
            }
            res.json(students);
        })
    });

    // '/student/list/:roomId' - Read students by roomId
    api.get('/list/:roomId', (req, res) => {
        let id = req.params.roomId;
        Student.find({homerooms: id}, (err, students) => {
            if(err){
                res.send(err);
            }
            res.json(students);
        });
    });

    // '/student/:studentId/teachers' - Read teachers by studentId
    api.get('/:studentId/teachers', (req, res) => {
        let id = req.params.studentId;
        Student.find({teachers: id}, (err, teachers) => {
            if (err) {
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/student/:studentId' - Read student by studentId
    api.get('/:studentId', (req, res) => {
        Student.findById(req.params.studentId, (err, student) => {
            if(err){
                res.send(err);
            }
            res.json(student);
        });
    });

    // '/student/update/:studentId' - Update student basic info
    api.patch('/update/:studentId', (req, res) => {
        Student.findById(req.params.studentId, (err, student) => {
            if (err) {
                res.send(err);
            }
            if(req.body.firstName !== undefined) {
                student.firstName = req.body.firstName;
            }
            if(req.body.lastName !== undefined) {
                student.lastName = req.body.lastName;
            }
            if(req.body.gradeLevel !== undefined) {
                student.gradeLevel = req.body.gradeLevel;
            }
            student.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: student.firstName + ' ' + student.lastName + ': Info updated successfully'});
            });
        });
    });

    // '/remove/:studentId' - Delete student
    api.delete('/remove/:studentId', (req, res) => {
        Student.findById(req.params.studentId, (err, student) => {
            let name = student.firstName + ' ' + lastName;
            let id = student._id;
            if(err){
                res.send(err);
            }
            Hub.find({students: id}, (err, hub) => {
                hub.pull(student);
                hub.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            Homeroom.find({students: id}, (err, room) => {
                room.pull(student);
                room.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            Teacher.find({students: id}, (err, teacher) => {
                teacher.pull(student);
                teacher.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            Student.remove(id, err => {
                if(err){
                    res.send(err);
                }
            });
            res.json({message: 'Student: ' + name + ' successfully removed'});
        });
    });

    return api;
}