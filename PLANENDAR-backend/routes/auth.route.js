const express = require('express')
const passport = require('passport')
const router = express.Router()
var jwt = require('express-jwt');


var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload',
    algorithms: ['RS256']
});

//@desc Auth with Google
//@route Get /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc google auth callback
// @route GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        console.log('res  got')
        res.send('/dashboard')
    })

// @desc Logout User
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout() //since we are using passport it provides this logout method in request
    res.redirect('/')
})


var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/auth.controller');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
module.exports = router