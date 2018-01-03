import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hub';
import Homeroom from '../model/homeroom';
import Teacher from '../model/teacher';
import Student from '../model/student';

export default ({config, db}) => {
    const api = Router();

    // '/hub/' - Create new hub
    api.post('/', (req, res) => {
        let newHub = new Hub();
        newHub.hubName = req.body.hubName;
        newHub.save(err => {
            if (err) {
                res.send(err);
            }
            res.json({message: newHub.hubName + ' has been created successfully'});
        });
    });

    // '/hub/' - Read all hubs
    api.get('/', (req, res) => {
        Hub.find({}, (err, hub) => {
            if (err) {
                res.send(err);
            }
            res.json(hub);
        });
    });

    // '/hub/:hubId' - Read hub by hubId
    api.get('/:hubId', (req, res) => {
        Hub.findById(req.params.hubId, (err, hub) => {
            if (err) {
                res.send(err);
            }
            res.json(hub);
        });
    });

    // '/hub/:hubId' - Update
    api.put('/:hubId', (req, res) => {
        Hub.findById(req.params.hubId, (err, hub) => {
            if (err) {
                res.send(err);
            }
            hub.hubName = req.body.hubName;
            hub.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: hub.hubName + ' info updated'});
            });
        });
    });

    // '/hub/:hubId' - Delete
    api.delete('/:hubId', (req, res) => {
        Hub.remove({_id: req.params.hubId}, (err, deletedHub) => {
            if (err) {
                res.send(err);
            }
            let id = deletedHub.homerooms;
            Homeroom.remove(id, err => {
                if (err) {
                    res.send(err);
                }
            });
            id = deletedHub.teachers;
            Teacher.remove(id, err => {
                if (err) {
                    res.send(err);
                }
            });
            id = deletedHub.students;
            Student.remove(id, err => {
                if (err) {
                    res.send(err);
                }
            });
            res.json({message: "Hub successfully removed"});
        });
    });

    return api;
}