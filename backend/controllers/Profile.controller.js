const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')

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

    getNotifications: async (req, res) => {
        console.log('get notifications')
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
                user['notifications'] = notifications

                return res.status(200).json({
                    msg: "notifications",
                    details: user,
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