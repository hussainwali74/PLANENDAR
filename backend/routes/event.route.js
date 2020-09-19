const express = require('express')
const router = express.Router()


const Event = require('../models/event.model');



//@desc Create event
//@route post /api/create-event
router.post('/create-event', (req, res, next) => {
    console.log("create event");
    console.log(req.body);
    let fetchedUser;
    const event = new Event({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        description: req.body.description,
        privacity: req.body.privacity,
        extra_fields: req.body.extra_fields,
    });

    event.save().then(result => {
        if (!result) {
            return res.status(401).json({
                msg: "Could not create the event Please try again",
                result: "false"
            });
        }
        console.log("event created")
        res.status(201).json({
            result: true,
            msg: "Event Created successfully",
            details: result
        })
    });

});

//@desc View event
//@route post /api/view-event
router.get('/view-event', (req, res, next) => {
    console.log('view event');

});


module.exports = router