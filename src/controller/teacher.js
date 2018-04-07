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

    // '/teacher/register' - Register new account
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

    // 'v1/teacher/login' - Login
    api.post('/login', passport.authenticate(
        'local', {
            session: false,
            scope: []
        }), generateAccessToken, respond);

    // 'v1/teacher/logout' - Logout
    api.get('/logout', authenticate, (req, res) => {
        res.logout();
        res.status(200).send('Successfully logged out');
    });

    // 'v1/teacher/me' - Get info about account
    api.get('/me', authenticate, (req, res) => {
        res.status(200).json(req.user);
    });

    // '/teacher/:teacherId/students' - Read all students by teacherId
    api.get('/:teacherId/students', authenticate, (req, res) => {
        let id = req.params.teacherId;
        Teacher.find({students: id}, (err, students) => {
            if (err) {
                res.send(err);
            }
            res.json(students);
        });
    });

    // '/teacher/:id' - Update teacher basic info
    // email will be unchangeable as it will be username
    // still need to figure out how to update terms and deeper levels with id's
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

    // '/teacher/:teacherId' - Delete teacher
    api.delete('/remove/:teacherId', authenticate, (req, res) => {
        Teacher.remove(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            res.json({message: "Teacher successfully removed"});
        });
    });

    // ****** Create methods ****** //

    api.post('/:teacherId/create/student/:termId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err + {message: ' error finding schoolTerm from teacher'});
            }
            SchoolTerm.findById(req.params.termId, (err, term) => {
                let newStudent = new Student();
                newStudent.firstName = req.body.firstName;
                newStudent.lastName = req.body.lastName;
                newStudent.gradeLevel = req.body.gradeLevel;
                newStudent.term = term._id;
                newStudent.save(err => {
                    if (err) {
                        res.send(err + {message: ' error saving newStudent object'});
                    }
                    term.students.push(newStudent);
                    term.save(err => {
                        if (err) {
                            res.send(err + {message: ' error saving student to teacher'});
                        }
                        res.json({message: 'New student saved'});
                    });
                });
            });
        })
    });


    //******Get Methods******//

    // '/teacher/:teacherId' - Get teacher by teacherId
    api.get('/:teacherId', authenticate, (req, res) => {
        Teacher.findById(req.params.teacherId, (err, teacher) => {
            if (err) {
                res.send(err);
            }
            res.json(teacher);
        });
    });

    // 'teacher/term/:termId' - Get term by termId
    api.get('/term/:termId', authenticate, (req, res) => {
        Teacher.findById({schoolTerms: req.params.termId}, (err, term) => {
            if (err) {
                res.send(err);
            }
            res.json(term);
        });
    });






    return api;
}

