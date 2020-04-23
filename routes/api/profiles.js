const express = require('express');
const router =  express.Router();
const mongoose = rewuire('mongoose');
const passport = require('passport');
const keys = require('../../config/keys')

// @route GET api/profiles/test
// @desc  Tests profiles route
// @access Public

router.get('/test', (req, res) => res.json({msg: "Profile works"}));

module.exports = router;