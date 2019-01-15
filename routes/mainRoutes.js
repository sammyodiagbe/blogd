'use strict'
const express = require('express');
const Joi = require('joi');
const User = require('../db/userModel');
const Post = require('../db/postModel');
const router = express.Router();

// logged in user middleware to check to see if the user is signed in or not
const loggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/auth/login');
    }
}


// exporting all routes 
module.exports = (passport) => {

    router.get('/', loggedIn, (req, res) => {
        const { user } = req;
        res.render('index', {
            page: 'index',
            authUser: user,
            postError: null,
            message: null,
            posts: Post.find({}, (err, data) => {
                return data;
            })
        });
    })

    router.post('/', (req, res) => {
        res.send('posting status yay....')
    })

    router.post('/dashboard', (req, res) => {
        const { post_content } = req.body;
        const schema = Joi.object().keys({
            post_content: Joi.string().trim().required()
        })

        Joi.validate({ post_content }, schema, (err, body) => {
            if (err) {
                res.render('dashboard', {
                    postError: 'There was an error',
                    page: 'dashboard',
                    authUser: req.user,
                    message: null,
                    posts: Post.find({})
                })
            } else {
                const post = new Post();
                post.post_content = post_content;
                post.post_author = req.user;
                post.save();
                Post.find({})
                    .exec((err, data) => {
                        console.log(typeof (data))
                        res.render('dashboard', {
                            authUser: req.user,
                            page: 'dashboard',
                            postError: null,
                            message: 'Your poss has been saved',
                            posts: data
                        });
                    })
            }
        })
    })

    router.get('/dashboard', loggedIn, (req, res) => {
        const { user } = req;
        Post.find({})
            .exec((err, data) => {
                res.render('dashboard', {
                    authUser: user,
                    page: 'dashboard',
                    postError: null,
                    message: null,
                    posts: data
                });
            })
    })

    router.get('/auth/login', (req, res, next) => {
        if (req.isAuthenticated()) res.redirect('/')
        res.render('login')
    })


    router.get('/auth/signup', (req, res) => {
        if (req.isAuthenticated()) res.redirect('/');
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
        successRedirect: '/',
    }), (req, res) => {
        res.send('login')
    })

    router.get('/auth/logout', (req, res) => {
        req.logOut();
        res.redirect('/auth/login');
    })
    return router;
};