import {Router} from 'express';
import Teacher from '../model/teacher';
import SchoolTerm from '../model/schoolTerm';
import Student from '../model/student';
import Subject from '../model/subject';
import Assignment from '../model/assignment';
import passport from 'passport';
import config from '../config/config';
import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default ({config, db}) => {
    let api = Router();

    // '/teacher/...' - Register new account
    api.post('/register', (req, res) => {
        Teacher.register(new Teacher({
            username: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }), req.body.password, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            passport.authenticate(
                'local', {
                    session: false
                })(req, res, () => {
                res.status(200).send('Successfully created new account');
            });
        });
    });

    // Login
    api.post('/login', passport.authenticate(
        'local', {
            session: false,
            scope: []
        }), generateAccessToken, respond);

    // Logout
    api.get('/logout', authenticate, (req, res) => {
        res.logout();
        res.status(200).send('Successfully logged out');
    });

    // Get info about account
    api.get('/me', authenticate, (req, res) => {
        res.status(200).json(req.user);
    });

    // Get teacher by teacherId
    api.get('/:teacherId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if(teacher === null){
                res.json('teacher not found')
            }
            else if (err) {
                res.send(err);
            }
            else {
                res.json(teacher);
            }
        });
    });

    // Update teacher basic info
    // email will be unchangeable as it will be username
    api.patch('/update/:teacherId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            if (req.body.firstName !== undefined) {
                teacher.firstName = req.body.firstName;
            }
            if (req.body.lastName !== undefined) {
                teacher.lastName = req.body.lastName;
            }
            if (req.body.password !== undefined) {
                teacher.password = req.body.password;
            }
            if (req.body.streetAddress !== undefined) {
                teacher.streetAddress = req.body.streetAddress;
            }
            if (req.body.usState !== undefined) {
                teacher.usState = req.body.usState;
            }
            if (req.body.zipCode !== undefined) {
                teacher.zipCode = req.body.zipCode;
            }
            if (req.body.phonePrimary !== undefined) {
                teacher.phonePrimary = req.body.phonePrimary;
            }
            if (req.body.phoneSecondary !== undefined) {
                teacher.phoneSecondary = req.body.phoneSecondary;
            }
            if (req.body.personalDescription !== undefined) {
                teacher.personalDescription = req.body.personalDescription;
            }
            if (req.body.avatar !== undefined) {
                teacher.avatar = req.body.avatar;
            }
            if (req.body.homeroomName !== undefined) {
                teacher.homeroomName = req.body.homeroomName;
            }
            if (req.body.homeroomName !== undefined) {
                teacher.homeroomName = req.body.homeroomName;
            }
            if (req.body.schoolTerm !== undefined) {
                teacher.schoolTerm = req.body.schoolTerm;
            }

            let students = req.body.schoolTerm.students;
            if (students.firstName !== undefined) {
                teacher.schoolTerm.students.firstName = req.body.students.firstName;
            }
            if (students.lastName !== undefined) {
                teacher.schoolTerm.students.lastName = req.body.students.lastName;
            }
            if (students.gradeLevel !== undefined) {
                teacher.schoolTerm.students.gradeLevel = req.body.students.gradeLevel;
            }

            let subjects = students.subjects;
            if (subjects.title !== undefined) {
                teacher.schoolTerm.students.subjects.title = req.body.subjects.title;
            }
            if (subjects.description !== undefined) {
                teacher.schoolTerm.students.subjects.description = req.body.subjects.description;
            }
            if (subjects.gradeScale !== undefined) {
                teacher.schoolTerm.students.subjects.gradeScale = req.body.subjects.gradeScale;
            }

            let assignments = subjects.assignments;
            if (assignments.title !== undefined) {
                teacher.schoolTerm.students.subjects.assignments.title = req.body.assignments.title;
            }
            if (assignments.description !== undefined) {
                teacher.schoolTerm.students.subjects.assignments.description = req.body.assignments.description;
            }
            if (assignments.correctAnswers !== undefined) {
                teacher.schoolTerm.students.subjects.assignments.correctAnswers = req.body.assignments.correctAnswers;
            }
            if (assignments.incorrectAnswers !== undefined) {
                teacher.schoolTerm.students.subjects.assignments.incorrectAnswers = req.body.assignments.incorrectAnswers;
            }

            teacher.save(err => {
                if (err) {
                    res.send(err);
                }
                res.json({message: teacher.firstName + ' ' + teacher.lastName + ': Info updated successfully'});
            });
        });
    });

    // Delete teacher
    api.delete('/remove/:teacherId', authenticate, (req, res) => {
        Teacher.find({_id: req.params.teacherId}, err => {
            if (err) {
                res.send(err+' :err finding teacher by id')
            }
            let id = req.params.teacherId
            SchoolTerm.find({teacher: id}, (err, term) => {
                if (err) {
                    res.send(err+' :err finding term in teacher')
                }
                if (term === null) {
                    res.status(404).send("term not found")
                }
                    Student.find({teacher: id}, (err, student) => {
                        if (err) {
                            res.send(err+' :err finding student in term')
                        }
                        if (student === null) {
                            res.status(404).send("student not found")
                        }
                            Subject.find({teacher: id}, (err, subject) => {
                                if (err) {
                                    res.send(err+' :err finding subject in student')
                                }
                                if (subject === null) {
                                    res.status(404).send("subject not found")
                                }
                                    Assignment.find({teacher: id}, (err, assignment) => {
                                        if (err) {
                                            res.send(err+' :err finding assignment in subject')
                                        }
                                        if (assignment === null) {
                                            res.status(404).send("assignment not found")
                                        }
                                    }).remove( err => {
                                        if (err) {
                                            res.send(err+' :err removing assignment')
                                        }
                                    })
                            }).remove( err => {
                                if (err) {
                                    res.send(err+' :err removing subject')
                                }
                            })

                    }).remove( err => {
                        if (err) {
                            res.send(err+' :err removing student')
                        }
                    })
            }).remove( err => {
                if (err) {
                    res.send(err + ' :err removing term')
                }
            })
        }).remove( err => {
            if (err) {
                res.send(err + ' :err removing teacher')
            }
        })
        res.json({message: "teacher successfully removed"})
    })

    return api;
}

