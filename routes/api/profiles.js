const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../Validation/profile');
const validateExperienceInput = require('../../Validation/experience');
const validateEducationInput = require('../../Validation/education');

// Load Profile model
const Profile = require('../../models/Profile');
// Load User profile
const User = require('../../models/User');


// @route GET api/profiles/test
// @desc  Tests profiles route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

// @route GET api/profile
// @desc  Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt',{session : false}), (req,res) => {
    const errors = {};

    Profile.findOne({user : req.user.id})
        .populate('user',['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = "There is no profile";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err=> res.status(404).json(err));
}
);

// @route GET api/profile/all
// @desc  Get all profiles
// @access Public
router.get('/all', (req,res) =>{
    const errors = {};
    Profile.find()
        .populate('users', ['name','avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = 'There are no profiles';
                res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(
            err=> res.status(404).json({profile: 'There are no profiles'})
        );
});

// @route GET api/profile/handle/:handle
// @desc  Get profile by handle
// @access Public

router.get('/handle/:handle', (req, res)=>{
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err=> res.status(404).json(err));
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by User ID
// @access Public

router.get('/user/:user_id', (req, res)=>{
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err=> res.status(404).json({profile: 'Thre is no profile for this user'}));
});



// @route POST api/profile/
// @desc  Create or Edit user profile
// @access Private
router.post('/', 
    passport.authenticate('jwt',{session : false}), (req,res) => {
        
        const {errors, isValid} = validateProfileInput(req.body);
        // Check Validation

        if(!isValid){
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }
        //Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        // Skills - split into array;
        if(typeof req.body.skills) profileFields.handle = req.body.handle;
        if(req.body.handle !=='undefined'){
            profileFields.skills = req.body.skills.split(',');
        } 
        // Social
        profileFields.social = {}
        if(req.body.youtube) profileFields.youtube = req.body.youtube;
        if(req.body.twitter) profileFields.twitter = req.body.twitter;
        if(req.body.facebook) profileFields.facebook = req.body.facebook;
        if(req.body.linkedin) profileFields.linkedin = req.body.linkedin;
        if(req.body.instagram) profileFields.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id})
            .then(profile => {
                if(profile){
                    //Update
                    Profile.findOneAndUpdate({ user: req.user.id}, {$set: profileFields}, {new: true})
                        .then(profile => res.json(profile));
                }else{
                    //Create

                    // Check if handle exists
                    Profile.findOne({ handle: profileFields.handle})
                        .then(profile=>{
                            if(profile){
                                errors.handle = 'That handle already exists';
                            }
                        // Save Profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                        });
                }
        });
    }
);



// @route POST api/profile/experience
// @desc  Add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const {errors, isValid} = validateExperienceInput(req.body);
        // Check Validation

        if(!isValid){
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

    Profile.findOne({ user: req.user.id})
        .then( profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                form: req.body.form,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            // Add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        })
});

// @route POST api/profile/education
// @desc  Add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req,res) =>{
    const {errors, isValid} = validateEducationInput(req.body);
        // Check Validation

        if(!isValid){
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

    Profile.findOne({ user: req.user.id})
        .then( profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                form: req.body.form,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            // Add to exp array
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        })
});


module.exports = router;