import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hub';
import Homeroom from '../model/homeroom';
import Teacher from '../model/teacher';
import Student from '../model/student';

export default ({config, db}) => {
    let api = Router();
    let homeroomCount = 0;

    // '/homeroom/:hubId' - Create new homeroom
    api.post('/create/:hubId', (req, res) => {
        Hub.findById(req.params.hubId, (err, hub) => {
            if (err) {
                res.send(err);
            }
            let newHomeroom = new Homeroom();
            newHomeroom.roomName = req.body.roomName;
            newHomeroom.hub = hub._id;
            newHomeroom.save((err, homeroom) => {
                if (err) {
                    res.send(err);
                }
                hub.homerooms.push(newHomeroom);
                hub.save(err => {
                    if (err) {
                        res.send(err);
                    }
                });
                homeroom.save(err => {
                    if (err) {
                        res.send(err);
                    }
                    res.json({message: newHomeroom.roomName + ' successfully added to ' + hub.hubName});
                });
            });
        });
    });

    // '/homeroom/' - Read all homerooms
    api.get('/', (req, res, next) => {
        Homeroom.find({}, (err, homeroom) => {
            if (err) {
                res.send(err);
            }
            res.json(homeroom);
        });
    });

    // '/homeroom/:roomId' - Read homeroom by id
    api.get('/:roomId', (req, res) => {
        //.findById method
        Homeroom.findById(req.params.roomId, (err, homeroom) => {
            if (err) {
                res.send(err);
            }
            res.json(homeroom);
        });
    });

    // '/homeroom/:roomId' - Update homeroom
    api.put('/update/:roomId', (req, res) => {
        Homeroom.findById(req.params.roomId, (err, homeroom) => {
            if (err) {
                res.send(err);
            }
            if (req.body.roomName !== undefined) {
                homeroom.roomName = req.body.roomName;
            }
            homeroom.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: homeroom.roomName + ' info updated'});
            });
        });
    });

    // '/homeroom/:roomId' - Remove homeroom
    api.delete('/remove/:roomId', (req, res) => {
        let id = req.params.roomId;
        Homeroom.findById(id, (err, homeroom) => {
            let homeroomName = homeroom.roomName;
            Hub.find({homerooms: id}, (err, hub) => {
                if (err) {
                    res.send(err);
                }
                hub.homerooms.pull(homeroom);
                hub.save(err => {
                    if (err) {
                        res.send(err);
                    }
                });
            });
            Homeroom.remove({_id: req.params.roomId}, (err, homeroom) => {
                if (err) {
                    res.send(err);
                }
                id = homeroom.teachers;
                Teacher.remove(id, err => {
                    if (err) {
                        res.send(err);
                    }
                });
                id = homeroom.students;
                Student.remove(id, err => {
                    if (err) {
                        res.send(err);
                    }
                });
                homeroomCount--;
                res.json({message: homeroomName + " successfully removed"});
            });
        });
    });

    return api;
}