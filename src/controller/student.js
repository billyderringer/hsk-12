import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hub';
import Homeroom from '../model/homeroom';
import Teacher from '../model/teacher';
import Student from '../model/student';

export default ({config, db}) => {
    let api = Router();

    // '/student/:roomId' - Create new students
    api.post('/:roomId', (req, res) => {
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

    // '/student/' - Read all students
    api.get('/', (req, res) => {
        Student.find({}, (err, students) => {
            if(err){
                res.send(err);
            }
            res.json(students);
        })
    });

    // '/student/:roomId' - Read students by roomId
    api.get('/:roomId', (req, res) => {
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

    // '/student/:studentId' - Update student basic info
    api.patch('/:studentId', (req, res) => {
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

    // '/:studentId' - Delete student
    api.delete('/remove/:studentId', (req, res) => {
        let id = req.params.studentId;
        Student.findById(req.params.studentId, (err, student) => {

            if(err){
                res.send(err);
            }
            Hub.findById(student.hub, (err, hub) => {
                if(err){
                    res.send(err);
                }
                hub.students.pull(student);
                hub.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            Homeroom.findById(student.homerooms, (err, room) => {
                if(err){
                    res.send(err);
                }
                room.students.pull(student);
                room.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
            });
            Student.remove(student, err => {
                if(err){
                    res.send(err);
                }
                res.json({message: "Student successfully removed"});
            });
        });
    });

    return api;
}