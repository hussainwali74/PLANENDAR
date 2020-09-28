const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')

module.exports = {
    getAllUsers: async (req, res) => {
        console.log('get all users')
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
    }
}
