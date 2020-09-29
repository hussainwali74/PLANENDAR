const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')

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
                // ===================================================================================
                const users = await User.find({ email: { $ne: email } }).populate('friends')
                let payload = [];
                let i = 0;
                users.map(user => {
                    user.email,
                        user.name,
                        user.photo ? user.photo : "-",
                        user.id
                })
                console.log("--------------------------------")
                console.log("users")
                console.log(users)
                console.log("--------------------------------")
                // ===================================================================================

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
            var authorization = req.headers.authorization;
            var decoded;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (error) {
                console.log('error in verify jwt')
                console.log(error)
            }
            var notification
            var sender_id;
            var receiver_id;
            // notification: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newNotification
            try {
                notification = await Notification.findById(req.body.notification_id);
                notification.seen = true;
                await notification.save();
                sender_id = notification.sender;
                receiver_id = notification.receiver;
            } catch (error) {
                console.log('error in notification findbyId')
                console.log(error)
            }
            var acceptedFriendRequest;
            //UPDATE THE FRIEND REQUEST STATUS
            try {
                acceptedFriendRequest = await FriendRequest.findOneAndUpdate({ sender: sender_id, receiver: receiver_id }, { status: "accepted" });
            } catch (error) {
                console.log('error in friendrequest  findoneandupdate')
                console.log(error)
            }
            var sender;
            var receiver;
            try {
                sender = await User.findById(receiver_id);
            } catch (error) {
                console.log('error in User  findById')
                console.log(error)
            }
            try {
                receiver = await User.findById(sender_id);
                sender.friends.push(receiver)
                receiver.friends.push(sender)
                sender.save()
                receiver.save()
            } catch (error) {
                console.log('error in User receiver findById')
                console.log(error)
            }
            const newNotification = new Notification({
                sender: receiver_id,
                receiver: sender_id,
                detail: sender.name + " accepted your Friend Request",
                seen: false,
                type: 'normal'
            })
            newNotification.sender = sender;
            newNotification.receiver = receiver;
            try {
                await newNotification.save();
            }
            catch (error) {
                console.log('error in newnotification save')
                console.log(error)
            }
            //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
            try {
                receiver.notifications.push(newNotification);
                await receiver.save();
                res.status(200).json({
                    msg: "Friend Request Accepted",
                    result: true,
                    details: null
                })
            } catch (e) {
                console.log("e===========================")
                console.log(e)
                return res.status(401).send('unauthorized');
            }
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('accept friend request unauthorized');
        }
    },

    rejectFriendRequests: async (req, res) => {
        console.log('rejeccct')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            var decoded;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (error) {
                console.log('error in verify jwt')
                console.log(error)
            }
            var notification
            var sender_id;
            var receiver_id;
            // notification: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newNotification
            try {
                notification = await Notification.findById(req.body.notification_id);
                notification.seen = true;
                await notification.save();
                sender_id = notification.sender;
                receiver_id = notification.receiver;
            } catch (error) {
                console.log('error in notification findbyId')
                console.log(error)
            }
            var acceptedFriendRequest;
            //UPDATE THE FRIEND REQUEST STATUS
            try {
                acceptedFriendRequest = await FriendRequest.findOneAndUpdate({ sender: sender_id, receiver: receiver_id }, { status: "rejected" });
            } catch (error) {
                console.log('error in friendrequest  findoneandupdate')
                console.log(error)
            }
            var sender;
            var receiver;
            try {
                sender = await User.findById(receiver_id);
            } catch (error) {
                console.log('error in User  findById')
                console.log(error)
            }
            try {
                receiver = await User.findById(sender_id);
            } catch (error) {
                console.log('error in User receiver findById')
                console.log(error)
            }
            const newNotification = new Notification({
                sender: receiver_id,
                receiver: sender_id,
                detail: sender.name + " rejected your Friend Request",
                seen: false,
                type: 'normal'
            })
            newNotification.sender = sender;
            newNotification.receiver = receiver;
            try {
                await newNotification.save();
            }
            catch (error) {
                console.log('error in newnotification save')
                console.log(error)
            }
            //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
            try {
                receiver.notifications.push(newNotification);
                await receiver.save();
                res.status(200).json({
                    msg: "Friend Request Accepted",
                    result: true,
                    details: null
                })
            } catch (e) {
                console.log("e===========================")
                console.log(e)
                return res.status(401).send('unauthorized');
            }
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('accept friend request unauthorized');
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
        const { receiver_id } = req.body;
        var receiver;

        try {
            receiver = await User.findOne({ _id: receiver_id });
        } catch (error) {
            console.log('error finding receiver')
            console.log(error)
        }
        var authorization = req.headers.authorization;
        if (req.headers && req.headers.authorization) {
            decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            var senderId;
            var sender;
            try {
                sender = await User.findOne({ email: decoded.email });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            senderId = sender._id;
            var friendRequests;
            try {
                friendRequests = await FriendRequest
                    .find({ sender: senderId, receiver: receiver_id }).populate('receiver').populate('sender');
            } catch (error) {
                console.log('error in finding friend requests 196')
                console.log(error)
            }
            if (friendRequests) {
                if (friendRequests.length != 0) {
                    console.log("friendRequests")
                    console.log(friendRequests)
                    return res.status(200).json({
                        msg: "Friend Request already sent",
                        result: false
                    });
                } else {
                    const newfriendRequest = new FriendRequest({
                        sender: senderId,
                        receiver: receiver_id,
                        status: 'pending',
                    });
                    newfriendRequest.receiver = receiver;
                    try {
                        let savedRequest = await newfriendRequest.save();
                        const newNotification = new Notification({
                            receiver: receiver_id,
                            sender: senderId,
                            detail: sender.name + " has sent you friend request",
                            type: 'friendrequest'
                        });
                        newNotification.receiver = receiver;
                        newNotification.sender = sender;
                        try {
                            await newNotification.save()
                        } catch (error) {
                            console.log('error in save notification')
                            console.log(error)
                        }
                        receiver.friendrequests.push(newfriendRequest)
                        receiver.notifications.push(newNotification)
                        try {
                            await receiver.save()
                        } catch (error) {
                            console.log('error in save receiver')
                            console.log(error)
                        }
                        return res.status(200).json({
                            msg: "Friend Request  sent",
                            result: false
                        });
                    } catch (error) {
                        console.log('error in save new request')
                    }
                }
            } else {
                console.log("==============================================================")
                console.log('ERROR friendRequests null')
                console.log("==============================================================")

            }

        }
    }
}
