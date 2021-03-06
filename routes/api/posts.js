const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Post model
const Post = require('../../models/Post');

//Profile model
const Profile = require('../../models/Profile');

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
        .sort(date : -1)
        .then(posts=> res.json(posts))
        .catch(err=> res.status(404).json({nopostsfound: 'No posts found'})
        );
});

// @route GET api/posts/:id
// @desc  Get postsby id
// @access Public
router.get('/:id',(req,res) => {
    post.findById(req.params.id)
        .then(post=> res.json(post))
        .catch(err=> res.status(404).json({nopostfound: 'No post found with that ID'})
        );
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

// @route DELETE api/post/:id
// @desc  Delete post
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then( post=>{
                    //check for post owner
                    if(post.user.toString() !== re.user.id){
                        return res.status(401).json({ notauthorized: 'User not authorized'});
                    }
                    // Delete
                    post.remove().then(() =>res.json({success: true}));
                })
                .catch(err=> res.status(404).json({postnotfound: 'No post found'}))
        })

// @route POST  api/posts/like/:id
// @desc  Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then( post=>{
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                        res.status(400).json({ alreadyliked: 'User already liked this post'});
                    }

                    // Add user id to like array
                    post.likes.unshift({ yser: req.user.id });

                    post.save().then(post => res.json(post));
                })
                .catch(err=> res.status(404).json({postnotfound: 'No post found'}))
        })
    
});

// @route POST  api/posts/unlike/:id
// @desc  UnLike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res)=> {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then( post=>{
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        res.status(400).json({ notliked: 'You have not liked this post'});
                    }

                    // Get remove index 
                    const removeIndex = post.like
                        .map(item => item.suer.toString())
                        .indexOf(req.user.id);

                    // Splice out of array
                    post.likes.splice(removeIndex1);

                    //Save
                    post.save().then(post=> res.json(post));
                })
                .catch(err=> res.status(404).json({postnotfound: 'No post found'}))
        })
    
});

module.exports = router;
