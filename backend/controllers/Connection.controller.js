const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')

module.exports = {

    //Friend Request
    // Verify active or sent connection exists
    // insert into connections table
    // (requester_id, requestee_id, is_active (set to false),status (set sent)) 


    // send friend request
    createRequest: async (req, res) => {
        console.log('send freind request')
        console.log(req.params)
        try {
            const db = req.app.get('db')
            //need to insert check to verify connection doesn't exist already
            // console.log(req.params, req.session.user)
            let { id: requestee_id } = req.params;
            let { id: requester_id } = req.session.user

            let is_active = false
            let status = "sent"
            // let request = await db.friendRequest({ requester_id, requestee_id, is_active, status })
            // console.log('sent friend request')
            // res.send(request)
        } catch (error) {
            console.log('error sending friend request:', error)
            res.status(500).send(error)
        }
    },

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

    acceptFriendRequests: async (req, res) => {
        console.log('acceptttt')
        if (req.headers && req.headers.authorization) {
            try {
                const acceptedFriendRequest = await FriendRequest.findOneAndUpdate({ _id: req.body.id }, { status: "accepted" });
                res.status(200).json({
                    msg: "acceptedFriendRequest",
                    result: true,
                    details: null
                })
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('unauthorized');
        }
    },
    rejectFriendRequests: async (req, res) => {
        if (req.headers && req.headers.authorization) {
            try {
                const acceptedFriendRequest = await FriendRequest.findOneAndUpdate({ _id: req.body.id }, { status: "rejected" });
                res.status(200).json({
                    msg: "FriendRequest rejected",
                    result: true,
                    details: null
                })
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('unauthorized');
        }
    },

    getFriendRequests: async (req, res) => {
        console.log("get friend requests")
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
                var userId;
                const user = await User.findOne({ email: decoded.email }).populate('friendrequests')
                userId = user._id;
                const friendRequests = await FriendRequest.find({ receiver: userId }).populate('sender');
                res.status(200).json({
                    msg: "friendrequests",
                    result: true,
                    details: friendRequests
                })
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('unauthorized');
        }
    },
    sendFriendRequest: async (req, res, next) => {
        console.log('send friend requests')
        const { id } = req.body.id
        var authorization = req.headers.authorization;

        if (req.headers && req.headers.authorization) {
            decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            var userId;
            try {
                const user = await User.findOne({ email: decoded.email });
                userId = user._id
                const friendRequests = await FriendRequest.find({ sender: req.body.id, receiver: userId }).populate('receiver');
                console.log("friendRequests")
                console.log(friendRequests)
                console.log('=====================--------------------------------------------')
                if (friendRequests) {
                    if (friendRequests.length != 0) {
                        return res.status(200).json({
                            msg: "Friend Request already sent",
                            result: false
                        });
                    } else {
                        const newfriendRequest = new FriendRequest({
                            sender: req.body.id,
                            receiver: userId,
                            status: 'pending',
                        });
                        newfriendRequest.receiver = user;
                        try {
                            let savedRequest = await newfriendRequest.save();
                            user.friendrequests.push(newfriendRequest)
                            await user.save()
                            return res.status(200).json({
                                msg: "Friend Request  sent",
                                result: false
                            });
                        } catch (error) {
                            console.log('error in save new request')
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }

        }

    }
}
