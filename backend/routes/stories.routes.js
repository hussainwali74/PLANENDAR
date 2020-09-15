const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth.middleware')

const Story = require('../models/Story')


//@desc show add story page
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    // res.send('Login')
    res.render('stories/add')
})

//@desc process add form
//@route POST /stories/add
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.render('errors/500')

    }
})
module.exports = router