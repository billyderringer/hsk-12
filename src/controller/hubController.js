import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hubModel';
import Homeroom from '../model/homeroomModel';

export default ({config, db}) => {
    const api = Router();

    // '/hub/create' - Create new hub(school)
    api.post('/create', (req, res) => {
        let newHub = new Hub();
        newHub.hubName = req.body.hubName;
        newHub.save(err => {
            if (err) {
                res.send(err);
            }
            res.json({message: newHub.hubName + ' has been created successfully'});
        });
    });

    // '/hub' - Read all hubs
    api.get('/list', (req, res) => {
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

    // '/hub/update/:hubId' - Update
    api.put('/update/:hubId', (req, res) => {
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

    // '/hub/remove/:hubId' - Delete
    api.delete('/remove/:hubId', (req, res) => {
        Hub.remove({_id: req.params.hubId}, (err, deletedHub) => {
            if (err) {
                res.send(err);
            }
            //No longer needed?***
            // ***Probably won't track these in hub***
            /*let idHomerooms = deletedHub.homerooms;
            let idTeachers = deletedHub.teachers;
            let idStudents = deletedHub.students;
            Homeroom.remove(idHomerooms, err => {
                if (err) {
                    res.send(err);
                }
            });

            Teacher.remove(idTeachers, err => {
                if (err) {
                    res.send(err);
                }
            });
            Student.remove(idStudents, err => {
                if (err) {
                    res.send(err);
                }
            });*/
            res.json({message: "Hub successfully removed"});
        });
    });

    return api;
}