import mongoose from 'mongoose';
import {Router} from 'express';
import School from '../model/schoolModel';
import Classroom from '../model/classroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();
    let classroomCount = 0;

    // '/hub/create' - Create Classroom
    api.post('/create', (req, res, next) => {
        let newClassroom = new Classroom();
        newClassroom.roomName = req.body.roomName;
        newClassroom.save((err, classroom) => {
            if (err) {
                res.send(err);
            }
            classroom.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: newClassroom.roomName + ' has been created successfully'});
                classroomCount++;
                console.log(classroomCount);
            });
        });
    });

    // '/hub' - Read all classrooms
    api.get('/', (req, res, next) => {
        Classroom.find({}, (err, classes) => {
            if (err) {
                res.send(err);
            }
            res.json(classes);
        });
    });

    // '/hub/:hubId' - Read classroom by id
    api.get('/:hubId', (req, res) => {
        //.findById method
        Classroom.findById(req.params.hubId, (err, classroom) => {
            if (err) {
                res.send(err);
            }
            res.json(classroom);
        });
    });

    // '/hub/update/:hubId' - Update classroom
    api.put('/update/:hubId', (req, res) => {
        Classroom.findById(req.params.hubId, (err, classroom) => {
            if (err) {
                res.send(err);
            }
            classroom.roomName = req.body.roomName;
            classroom.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: classroom.roomName + ' info updated'});
            });
        });
    });

    // '/hub/remove/:id' - Delete classroom
    api.delete('/remove/:id', (req, res) => {
        Classroom.remove({_id: req.params.id}, (err, deletedClass) => {
            if (err) {
                res.send(err);
            }
            let id = deletedClass.teachers;
            Teacher.remove(id, (err, teachers) => {
                if (err) {
                    res.send(err);
                }
            });
            id = deletedClass.students;
            Student.remove(id, (err, students) => {
                if (err) {
                    res.send(err);
                }
                res.json({message: "Classroom successfully removed"});
            });
        });
    });

    return api;
}