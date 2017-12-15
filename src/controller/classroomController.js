import mongoose from 'mongoose';
import {Router} from 'express';
import Classroom from '../model/classroomModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();

    // '/classroom/add' - Create Classroom
    api.post('/add', (req, res) => {
        let newClass = new Classroom();
        newClass.roomName = req.body.roomName;
        newClass.save(err => {
            if(err){
                res.send(err);
            }
            res.json({message: newClass.roomName + ' has been created successfully'})
        });
    });

    // '/classroom' - Read **** May not use
    api.get('/', (req, res) => {
        Classroom.find({},(err, classes) =>{
            if(err){
                res.send(err);
            }
            res.json(classes);
        });
    });

    // '/classroom/:id' - Read 1
    api.get('/:id', (req, res) => {
        //.findById method
        Classroom.findById(req.params.id, (err, classroom) => {
            if(err){
                res.send(err);
            }
            res.json(classroom);
        });
    });

    // '/classroom/:id' - Update
    api.put('/:id', (req, res) => {
        Classroom.findById(req.params.id, (err, room) => {
            if(err){
                res.send(err);
            }
            room.roomName = req.body.roomName;
            room.save(err => {
                if(err){
                    res.send(err);
                }
                res.json({message: room.roomName + ' info updated'});
            });
        });
    });

    // '/classroom/:id' - Delete
    api.delete('/:id', (req, res) => {
        Classroom.remove({_id: req.params.id}, (err, deletedClass) => {
            if(err){
                res.send(err);
            }
            res.json({message: "Classroom successfully removed"});
        });
    });

return api;
}