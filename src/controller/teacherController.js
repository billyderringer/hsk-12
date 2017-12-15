import mongoose from 'mongoose';
import {Router} from 'express';
import Classroom from '../model/classroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();

    // '/classroom/teachers/teacher/add/:id' - Create new teachers
    api.post('/teacher/add/:id', (req, res) => {
        Classroom.findById(req.params.id, (err, classroom) => {
            if(err){
                res.send(err);
            }
            let newTeacher = new Teacher();
            newTeacher.firstName = req.body.firstName;
            newTeacher.lastName = req.body.lastName;
            newTeacher.classrooms = classroom.id;
            newTeacher.save((err, teacher) => {
                if(err){
                    res.send(err);
                }
                classroom.teachers.push(newTeacher);
                classroom.save(err => {
                    if(err){
                        res.send(err);
                    }
                    res.json({message: 'Teacher successfully created'});
                });
            });
        });
    });

    // '/classroom/teachers/:id' - Read all teachers
    api.get('/:id', (req, res) => {
        Teacher.find({classrooms: req.params.id},(err, teachers) =>{
            if(err){
                res.send(err);
            }
            res.json(teachers);
        });
    });

    // '/classroom/teachers/teacher/:id' - Read teacher by id
    api.get('/teacher/:id', (req, res) => {
        Teacher.findById(req.params.id, (err, teacher) => {
            if(err){
                res.send(err);
            }
            res.json(teacher);
        });
    });

    // '/classroom/teachers/teacher/:id' - Update
    api.put('/teacher/:id', (req, res) => {
        Teacher.findById(req.params.id, (err, teacher) => {
            if(err){
                res.send(err);
            }
            if(req.body.firstName !== undefined) {
                teacher.firstName = req.body.firstName;
            }
            if(req.body.lastName !== undefined) {
                teacher.lastName = req.body.lastName;
            }
            teacher.save(err => {
                if(err){
                    res.send(err);
                }
                res.json({message: teacher.firstName + ' ' + teacher.lastName + '\'s info updated successfully'});
            });
        });
    });

    // '/classroom/teachers/teacher/:id' - Delete
    api.delete('/teacher/:id', (req, res) => {
        Teacher.remove({_id: req.params.id}, (err, teacher) => {
            if(err){
                res.send(err);
            }
            res.json({message: req.params.firstName + ' ' + req.params.lastName + 'deleted successfully'});
        });
        Classroom.findById(req.params.id, (err, classroom) => {
            if(err){
                res.send(err);
            }
            classroom.teachers.splice(Teacher.indexOf(req.params.id),1, err => {
                if(err){
                    res.send(err);
                }
                res.json({message: 'Teacher removed from Classroom Successfully'});
            });
        });
    });


return api;
}