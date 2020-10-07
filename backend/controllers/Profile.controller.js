const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')
const Event = require('../models/event.model');
const EventInviteModel = require('../models/EventInvite.model');

module.exports = {
    getsAllUsers: async (req, res) => {
        console.log('get all usesrs')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {
                User.find({ email: { $ne: email } }).then((docs) => {
                    let payload = [];
                    let i = 0;
                    docs.forEach(doc => {
                        payload[i] = {
                            email: doc.email,
                            name: doc.name,
                            photo: doc.photo ? doc.photo : "-",
                            id: doc._id
                        }
                        i++;
                    })
                    return res.status(200).json({
                        msg: "all users",
                        details: payload,
                        result: true
                    })
                })
            } catch (error) {
                console.log('error getting your friend:', error)
                res.status(500).send(error)
            }
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('unauthorized');
        }
    },

    getNotificationCount: async (req, res) => {
        console.log('get new notifications count 51 Profile.controller')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {
                const user = await User.findOne({ email: email }).populate('notifications');
                let newnotifications = user.notifications.filter(x => x.seen != true)
                console.log("\n");
                console.log("newnotifications");
                console.log(newnotifications.length);
                console.log("\n");
                return res.status(200).json({
                    msg: "new_notifications",
                    details: newnotifications.length,
                    result: true
                })
            } catch (e) {
                console.log(e)
            }
        }
    },

    getNotifications: async (req, res) => {
        console.log('get notifications 81 Profile.controller')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;

            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {
                const user = await User.findOne({ email: email }).populate('friendrequests');
                const receiver_id = user._id;
                const notifications = await Notification.find({ receiver: receiver_id }).populate('sender');
                const eventInvitedTo = await EventInviteModel.find({ receiver: receiver_id }).populate('event');
                let events;
                events = eventInvitedTo.filter(invite => { return invite['event'] })
                let newuser = {}
                newuser['user'] = user;
                newuser['notifications'] = notifications;
                newuser['events'] = events;

                return res.status(200).json({
                    msg: "notifications",
                    details: newuser,
                    result: true
                })
            } catch (e) {
                console.log(e)
            }
        }
    },
    getProfile: async (req, res) => {
        console.log('get user profile')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {
                const user = await User.findOne({ email: email })

                return res.status(200).json({
                    msg: "user profile",
                    details: user,
                    result: true
                })
            } catch (e) {
                console.log(e)
            }
        }
    },
    updateProfile: async (req, res) => {
        console.log('update profile')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {
                const hash = await bcrypt.hash(req.body.password, 10);
                console.log("hash")
                console.log(hash)
                const user = await User.findOneAndUpdate({ email: email }, { password: hash, email: req.body.email, name: req.body.name })

                return res.status(200).json({
                    msg: "user profile updated",
                    details: user,
                    result: true
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
}
