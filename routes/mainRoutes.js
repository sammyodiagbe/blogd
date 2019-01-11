'use strict'
const express = require('express');
const Joi = require('joi');
const User = require('../db/userModel');
const router = express.Router();


const loggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/auth/login');
    }
}




module.exports = (passport) => {

    router.get('/profile', loggedIn, (req, res) => {
        const { user } = req;
        console.log(user);
        res.render('profile', {
            authUser: user
        });
    })

    router.get('/auth/login', (req, res) => {
        if (req.session.user) return res.redirect('/');
        res.render('login')
    })


    router.get('/auth/signup', (req, res) => {
        res.render('signup', {
            error: null,
            message: null
        });
    })

    router.post('/auth/signup', (req, res) => {
        const { firstname, lastname, email, password, confirm_password } = req.body;
        const schema = Joi.object().keys({
            firstname: Joi.string().trim().required(),
            lastname: Joi.string().trim().required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().min(7).max(30),
            confirm_password: Joi.string().trim().min(7).max(30),
        });
        Joi.validate({ firstname, lastname, email, password, confirm_password }, schema, (err, data) => {
            if (err) {
                res.render('signup', {
                    error: 'Invalid data provided, please try again',
                    message: null
                })
            } else {
                const { firstname, lastname, email, confirm_password, password } = data;

                User.findOne({ email: email }, (err, user) => {
                    if (err) {
                        res.render('signup', {
                            error: 'Invalid data provided, please try again',
                            message: null
                        })
                    } else {
                        if (user) {
                            res.render('signup', {
                                error: 'User already exist',
                                message: null
                            })
                        } else {
                            if (password === confirm_password) {
                                const user = new User();
                                user.firstname = firstname;
                                user.lastname = lastname;
                                user.email = email;
                                user.password = user.hashPassword(password);
                                user.save((err, success) => {
                                    if (err) {
                                        res.render('signup', {
                                            error: 'Invalid data provided, please try again',
                                            message: null
                                        })
                                    } else {
                                        res.render('signup', {
                                            error: null,
                                            message: 'Account Created'
                                        })
                                    }
                                })
                            } else {
                                res.render('signup', {
                                    error: 'Passwords do not match',
                                    message: null
                                })
                            }
                        }
                    }
                })

            }
        })

    })


    router.post('/auth/login', passport.authenticate('local', {
        failureRedirect: '/auth/login',
        successRedirect: '/profile',
    }), (req, res) => {
        res.send('login')
    })

    router.get('/auth/logout', (req, res) => {
        req.logOut();
        res.redirect('/auth/login');
    })
    return router;
};