const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Post model
const Post = require('../../models/Post');

//Validation
const validatePostInput = require('../../Validation/post');

// @route GET api/posts/test
// @desc  Tests post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// @route GET api/posts
// @desc  Get posts
// @access Public
router.get('/',(req,res) => {
    post.find()
        .sort(date: -1)
        .then(posts=> res.json(posts))
        .catch(err=> res.status(404));
});

// @route POST api/posts
// @desc  Tests post route
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    //Check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.bosy.text,
        name: req.body.name,
        avatar: req.body.name,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
});


module.exports = router;
