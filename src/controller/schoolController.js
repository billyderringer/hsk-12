import mongoose from 'mongoose';
import {Router} from 'express';
import School from '../model/schoolModel';
import Classroom from '../model/classroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();

    // '/hub/add' - Create new school
    api.post('/add', (req, res) => {
        let newHub = new School();
        newHub.hubName = req.body.hubName;
        newHub.save(err => {
            if (err) {
                res.send(err);
            }
            res.json({message: newHub.hubName + ' has been created successfully'});
        });
    });

    // '/hub' - Read all schools
    api.get('/', (req, res) => {
        School.find({}, (err, hub) => {
            if (err) {
                res.send(err);
            }
            res.json(hub);
        });
    });

    // '/hub/teachers/:schoolId' - Read all teachers
    api.get('/teachers/:schoolId', (req, res) => {
        School.findById(req.params.schoolId, (err, school) => {
            if (err) {
                res.send(err);
            }
            res.json(school.teachers);
        });
    });

    // '/hub/students/:schoolId' - Read all students
    api.get('/students/:schoolId', (req, res) => {
        School.findById(req.params.schoolId, (err, school) => {
            if (err) {
                res.send(err);
            }
            res.json(school.students);
        });
    });

    // '/hub/update' - Update
    api.put('/update', (req, res) => {
        School.find({}, (err, hub) => {
            if (err) {
                res.send(err);
            }
            hub.hubName = req.body.roomName;
            hub.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: hub.hubName + ' info updated'});
            });
        });
    });

    // '/hub/remove' - Delete
    api.delete('/remove/:id', (req, res) => {
        School.remove({_id: req.params.id}, (err, deletedHub) => {
            if (err) {
                res.send(err);
            }
            let idClassRooms = deletedHub.classrooms;
            let idTeachers = deletedHub.teachers;
            let idStudents = deletedHub.students;
            Classroom.remove(idClassRooms, (err, classrooms) => {
                if (err) {
                    res.send(err);
                }
            });
            Teacher.remove(idTeachers, (err, teachers) => {
                if (err) {
                    res.send(err);
                }
            });
            Student.remove(idStudents, (err, students) => {
                if (err) {
                    res.send(err);
                }
            });
            res.json({message: "Classroom successfully removed"});
        });
    });

    return api;
}