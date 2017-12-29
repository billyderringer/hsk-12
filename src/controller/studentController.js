import mongoose from 'mongoose';
import {Router} from 'express';
import School from '../model/hubModel';
import Classroom from '../model/homeroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();

    // '/classroom/students/add/:id' - Create new students
    api.post('/add/:id', (req, res) => {
        School.findById(req.params.id, (err, school) => {
            if(err){
                res.send(err);
            }
            let newStudent = new Student();
            newStudent.firstName = req.body.firstName;
            newStudent.lastName = req.body.lastName;
            newStudent.gradeLevel = req.body.gradeLevel;
            newStudent.gradingScale = req.body.gradingScale;
            newStudent.school = school._id;
            newStudent.save((err, student) => {
                if(err){
                    res.send(err);
                }
                school.students.push(newStudent);
                school.save(err => {
                    if(err){
                        res.send(err);
                    }
                });
                student.save(err => {
                    if(err){
                        res.send(err);
                    }
                    res.json({message: 'Student successfully saved to school'});
                });
            });

        });
    });


    return api;
}