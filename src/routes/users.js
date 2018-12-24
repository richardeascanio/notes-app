//const router = require('express').Router();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Please insert your name'})
    }
    if(email.length <= 0){
        errors.push({text: 'Please insert your email'})
    }
    if(password != confirm_password){
        errors.push({text: 'Passwords do not match'});
    }
    if(password.length < 4){
        errors.push({text: 'Password must have at least 4 characters'});
    }
    if(errors.length > 0){
        res.render('users/signup', { errors, name, email });
    }
    else{
        const emailUser = await User.findOne({ email: email });
        if(emailUser){
            req.flash('error_msg', 'This email is already in use');
            res.redirect('/users/signup');
        }
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Sign up successfull');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;