const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Event = require('../models/event.model');
const Post = require('../models/post');


require('dotenv').config()

//@desc Create event
//@route post /api/create-event
router.post('/create-event', (req, res, next) => {

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization;
        try {
            decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        var email = decoded.email;
        // Fetch the user by id 
        Post.findOne({ email: email }).then(function (user) {
            // Do something with the user
            const event = new Event({
                title: req.body.title,
                date: req.body.date,
                user_id: user._id,
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
                res.status(201).json({
                    result: true,
                    msg: "Event Created successfully",
                    details: result
                })
            });
        });
    } else {
        console.log('no headers 51 ')
    }
});

//@desc View event
//@route post /api/view-event
router.get('/view-event', (req, res, next) => {
    console.log('view event');
});

//@desc View User created event
//@route post /api/view-user-event
router.get('/view-user-events', (req, res, next) => {
    console.log('view event');
    var userId;
    var x = jwt.verify(req.headers.authorization, process.env.EMAIL_SECRET)
    Post.findOne({ email: x.email }).then((docs) => {
        userId = docs._id;
        Event.find({ user_id: userId }).then((docs) => {
            // console.log(docs)
            return res.status(200).json({
                msg: "events created by the user",
                details: docs,
                result: true
            });

        })
    });
});

module.exports = router