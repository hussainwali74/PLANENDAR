const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth.middleware')
//@desc Login/Landing page
//@route GET /

const Story = require('../models/Story')

router.get('/', ensureGuest, (req, res) => {
    res.send('Login')
    // res.render('login', {
    //     layout: 'login',
    // })
})

//@desc Dashboard
//@route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        // res.send('Dashboard')
        console.log(req.user)
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        });
    } catch (error) {
        console.log(error)
        res.render('errors/500')
    }

})

module.exports = router