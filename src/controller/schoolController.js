import mongoose from 'mongoose';
import {Router} from 'express';
import School from '../model/schoolModel';

export default ({config, db}) => {
    let api = Router();

    // '/v1/school/add' - Create
    api.post('/add', (req, res) => {
        let newSchool = new School();
        newSchool.name = req.body.name;
        newSchool.principalName = req.body.principalName;
        newSchool.save(err => {
            if(err){
                res.send(err);
            }
            res.json({message: newSchool.name + ' has been created successfully'})
        });
    });

    // '/v1/school' - Read
    api.get('/', (req, res) => {
        School.find({},(err, schools) =>{
            if(err){
                res.send(err);
            }
            res.json(schools);
        });
    });

    // '/v1/school/:id' - Read 1
    api.get('/:id', (req, res) => {
        //.findById method
        School.findById(req.params.id, (err, school) => {
            if(err){
                res.send(err);
            }
            res.json(school);
        });
    });

    // '/v1/school/:id' - Update
    api.put('/:id', (req, res) => {
        School.findById(req.params.id, (err, updatedSchool) => {
            if(err){
                res.send(err);
            }
            updatedSchool.name = req.body.name;
            updatedSchool.principalName = req.body.principalName;
            updatedSchool.save(err => {
                if(err){
                    res.send(err);
                }
                res.json({message: updatedSchool.name + ' info updated'});
            });
        });
    });

    // '/v1/school/:id' - Delete
    api.delete('/:id', (req, res) => {
        School.remove({_id: req.params.id}, (err, deletedSchool) => {
            if(err){
                res.send(err);
            }
            res.json({message: "School successfully removed"});
        });
    });

return api;
}