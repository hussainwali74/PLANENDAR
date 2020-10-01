const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')
const EventInvite = require('../models/EventInvite.model')
const Event = require('../models/event.model')
module.exports = {
    //POST
    // /api/send-event-invites
    // send event invitation to contacts
    sendEventInvites: async (req, res) => {
        console.log('send event invite')
        const { event_id } = req.body.event_id;
        var alreadyInvited = [];
        var currentInvited = [];
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                console.log('autherizing jwt')
                console.log(e)
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;

            var eventInvite;
            var sender_id;
            var receiver_id;
            try {
                sender = await User.findOne({ email: decoded.email });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            sender_id = sender._id;
            var event;
            try {
                event = await Event.findOne({ _id: req.body.event_id });
            } catch (error) {
                console.log('error finding event')
                console.log(error)
            }

            for (let index = 0; index < req.body.receivers.length; index++) {
                receiver_id = req.body.receivers[index];

                try {
                    eventInvite = await EventInvite
                        .find({ receiver: receiver_id, event_id }).populate('receiver')
                } catch (error) {
                    console.log('find user')
                    console.log(e)
                }
                console.log("============event=======================")
                console.log(eventInvite)

                try {
                    receiver = await User.findOne({ _id: receiver_id });
                } catch (error) {
                    console.log('error finding receiver')
                    console.log(error)
                }

                if (eventInvite) {
                    if (eventInvite.length != 0) {
                        console.log('WHEN EVENT.LENGGTH==0')
                        console.log(eventInvite);
                        alreadyInvited.push({ invited: eventInvite['0']['receiver']['name'] });
                    } else {

                        const newInvite = new EventInvite({
                            sender: sender_id,
                            receiver: receiver_id,
                            event: event._id
                        });
                        newInvite.sender = sender;
                        newInvite.receiver = receiver;
                        newInvite.event = event;

                        try {
                            saveInvite = await newInvite.save();
                        } catch (error) {
                            console.log('error in save new request')
                            console.log(error)
                        }
                        const newNotification = new Notification({
                            receiver: receiver_id,
                            sender: sender_id,
                            detail: sender.name + " has invited you to an event",
                            type: 'eventinvite'
                        });
                        newNotification.receiver = receiver;
                        newNotification.sender = sender;
                        try {
                            await newNotification.save()
                        } catch (error) {
                            console.log('error in save notification')
                            console.log(error)
                        }
                        // receiver.friendrequests.push(newfriendRequest);
                        receiver.notifications.push(newNotification);
                        receiver.eventinvites.push(newInvite);
                        try {
                            await receiver.save()
                            console.log(receiver.name)
                            currentInvited.push({ invited: receiver.name });
                        } catch (error) {
                            console.log('error in save receiver')
                            console.log(error)
                        }

                    } //END - ELSE EVENT.LENGTH==0
                } else {
                    console.log("==============================================================")
                    console.log('ERROR eventInvite null')
                    console.log("==============================================================")
                }
            }//END - FOR 
        }
        console.log('\n')
        console.log("alreadyInvited")
        console.log(alreadyInvited)
        console.log('\n')
        console.log("currentInvited")
        console.log(currentInvited)
        console.log('\n')
        return res.status(200).json({
            msg: "Event Invitations Sent ",
            result: true,
            details: null
        });

    },


    acceptEventInvite: async (req, res) => {
        console.log('acceptttt event invite')
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
            } catch (error) {
                console.log('error in notification findbyId')
                console.log(error)
            }
            try {
                event = await Event.findById(req.body.event_id);
            } catch (error) {
                console.log('error in notification findbyId')
                console.log(error)
            }
            notification.seen = true;
            try {
                await notification.save();
            } catch (error) {
                console.log('error in notification save')
                console.log(error)
            }
            sender_id = notification.sender;
            receiver_id = notification.receiver;

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
                console.log('error in User sender findById')
                console.log(error)
            }

            if (sender.events.includes(req.body.event_id)) {
                console.log(sender)
                return res.status(200).json({
                    msg: "Invitation  Already Accepted",
                    result: true,
                    details: null
                })
            } else {
                console.log('=-====================else')
                var acceptedInvite;
                //UPDATE THE FRIEND REQUEST STATUS
                try {
                    acceptedInvite = await EventInvite.findOneAndUpdate({ sender: sender_id, receiver: receiver_id }, { status: "accepted" });
                } catch (error) {
                    console.log('error in friendrequest  findoneandupdate')
                    console.log(error)
                }
            }

            receiver.events.push(sender)

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
            } catch (error) {
                console.log('error in newnotification save')
                console.log(error)
            }
            //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
            try {
                receiver.notifications.push(newNotification);
                await receiver.save();
                sender.save()

                return res.status(200).json({
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

    // used in : contactlists/contact
    getAllUsers: async (req, res) => {
        console.log('get all users')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                console.log('autherizing jwt')
                console.log(e)
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {
                // ===================================================================================
                const users = await User.find({ email: { $ne: email } }).populate('friends')
                users.map(user => {
                    user.email,
                        user.name,
                        user.photo ? user.photo : "-",
                        user.id
                })
                // ===================================================================================

                return res.status(200).json({
                    msg: "all users list",
                    details: users,
                    result: true
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
            var notification;
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

            var sender;
            var receiver;

            try {
                sender = await User.findById(receiver_id);
            } catch (error) {
                console.log('error in User  findById')
                console.log(error)
            }

            if (sender.friends.includes(sender_id)) {
                console.log(sender)
                return res.status(200).json({
                    msg: "Friend Request Already Accepted",
                    result: true,
                    details: null
                })
            } else {
                console.log('=-====================else')
                var acceptedFriendRequest;
                //UPDATE THE FRIEND REQUEST STATUS
                try {
                    acceptedFriendRequest = await FriendRequest.findOneAndUpdate({ sender: sender_id, receiver: receiver_id }, { status: "accepted" });
                } catch (error) {
                    console.log('error in friendrequest  findoneandupdate')
                    console.log(error)
                }

                try {
                    sender.friends.push(receiver)
                    receiver.friends.push(sender)
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
                } catch (error) {
                    console.log('error in newnotification save')
                    console.log(error)
                }
                //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
                try {
                    receiver.notifications.push(newNotification);
                    await receiver.save();
                    sender.save()

                    return res.status(200).json({
                        msg: "Friend Request Accepted",
                        result: true,
                        details: null
                    })
                } catch (e) {
                    console.log("e===========================")
                    console.log(e)
                    return res.status(401).send('unauthorized');
                }

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
    getFriends: async (req, res) => {
        console.log("get friends of loggedin user")
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
                var userId;
                const user = await User.findOne({ email: decoded.email }).populate('friends')
                userId = user._id;
                // const friendRequests = await FriendRequest.find({ receiver: userId }).populate('sender');
                res.status(200).json({
                    msg: "friendrequests",
                    result: true,
                    details: user
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
                    let savedRequest;
                    try {
                        savedRequest = await newfriendRequest.save();
                    } catch (error) {
                        console.log('error in save new request')
                        console.log(error)
                    }
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
                }
            } else {
                console.log("==============================================================")
                console.log('ERROR friendRequests null')
                console.log("==============================================================")

            }

        }
    }
}
