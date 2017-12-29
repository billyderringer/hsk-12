import mongoose from 'mongoose';
import {Router} from 'express';
import Hub from '../model/hubModel';
import Homeroom from '../model/homeroomModel';
import Teacher from '../model/teacherModel';
import Student from '../model/studentModel';

export default ({config, db}) => {
    let api = Router();
    let homeroomCount = 0;

    // '/homeroom/create/:hubId' - Create new homeroom
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
                    if(err){
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

    // '/homeroom/list' - Read all homerooms
    api.get('/list', (req, res, next) => {
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

    // '/homeroom/update/:roomId' - Update homeroom
    api.put('/update/:roomId', (req, res) => {
        Homeroom.findById(req.params.roomId, (err, homeroom) => {
            if (err) {
                res.send(err);
            }
            homeroom.roomName = req.body.roomName;
            homeroom.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: homeroom.roomName + ' info updated'});
            });
        });
    });

    // '/homeroom/remove/:hubId/:roomId' - Delete homeroom from hub
   /* api.delete('/remove/:hubId/:roomId', (req, res) => {
        Homeroom.remove({_id: req.params.roomId}, (err, homeroom) => {
            if (err) {
                res.send(err);
            }
            let id = homeroom.teachers;
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
                res.json({message: homeroom.roomName + " successfully removed"});
            });

            Hub.remove({_id: req.params.hubId.homerooms.roomId}, err => {
                if (err) {
                    res.send(err);
                }
            });
        });
    });*/
   api.delete('/remove/:roomId', (req, res) => {
       Hub.pre('remove', next => {
           if(err){
               next(new Error('Could not find Hub'));
           }
           this.model('Hub').remove({homerooms: this._id}, next);
       });
       Homeroom.remove({_id: req.params.roomId}, (err, homeroom) => {
           if (err) {
               res.send(err);
           }
           let id = homeroom.teachers;
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
               res.json({message: homeroom.roomName + " successfully removed"});
           });
       });
   });

    return api;
}