const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')
const EventInvite = require('../models/EventInvite.model')
const Event = require('../models/event.model')
const List = require('../models/List.model')

module.exports = {
    //POST
    // /api/send-event-invites
    // send event invitation to contacts
    createList: async (req, res) => {
         if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                console.log('autherizing jwt')
                console.log(e)
                return res.status(401).send('unauthorized');
            }
            let sender;
            try {
                sender = await User.findOne({ email: decoded.email });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            let sender_id = sender._id;
            let list;
            console.log('req.body.list_name')
            console.log(req.body.list_name)
            list = new  List({ name: req.body.list_name,creator:sender_id });
            list.creator = sender;
            try {
                await list.save()
            } catch (error) {
                console.log('46: list controller: error in save list')
                console.log(error)
            }
            sender.lists.push(list);
            try {
                await sender.save();
                } catch (error) {
                    console.log('49: list control error in save list to user')
                    console.log(error)
            }
            return res.status(200).json({
                msg: "List created successfuly ",
                result: true,
                details: null
            });
        }else{
            console.log('62: list contorller')
        }
    },
    getMyLists: async (req, res) => {
        console.log('60 list controller get my lists')
         if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                console.log('autherizing jwt')
                console.log(e)
                return res.status(401).send('unauthorized');
            }
            let sender;
            try {
                sender = await User.findOne({ email: decoded.email });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            let sender_id = sender._id;
            let lists;
            lists = await  List.find({creator:sender_id }).populate('contacts');
            return res.status(200).json({
                msg: "My Lists  ",
                result: true,
                details: lists
            });
        }else{
            console.log('62: list contorller')
        }
    },
    getListDetails: async (req, res) => {
        console.log('60 list controller get my lists')
        console.log("req.params.list_id")
        console.log(req.params.list_id)
        let list_id = req.params.list_id;
         if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                console.log('autherizing jwt')
                console.log(e)
                return res.status(401).send('unauthorized');
            }
            let sender;
            try {
                sender = await User.findOne({ email: decoded.email });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            let sender_id = sender._id;
            let lists;
            lists = await  List.findOne({_id:list_id, creator:sender_id }).populate('contacts');
            return res.status(200).json({
                msg: "My Lists  ",
                result: true,
                details: lists
            });
        }else{
            console.log('62: list contorller')
        }
    },
    
    deleteList: async (req, res) => {
        console.log('90 delete list controller get my lists')
         if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                console.log('autherizing jwt')
                console.log(e)
                return res.status(401).send('unauthorized');
            }
            let sender;
            try {
                sender = await User.findOne({ email: decoded.email });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            let sender_id = sender._id;
            let lists;
            try {
                lists = await  List.findOneAndDelete({_id:req.body.list_id,creator:sender_id });
            } catch (error) {
                console.log('error in finding sender')
                console.log(error)
            }
            try {
                me = await User.findOneAndUpdate({"_id":  sender_id },
                {$pull:{'lists':req.body.list_id}}
                ).exec();
            } catch (error) {
                console.log("\n")
                console.log('122:error in list controller ')
                console.log(error)
                console.log("\n")                
                return res.status(200).json({
                    msg: "error",
                    result: false,
                    error:error
                });
            }
            return res.status(200).json({
                msg: "List deleted ! ",
                result: true,
                // details: lists
            });
        }else{
            console.log('62: list contorller')
        }
    },
 

    addContactsToList: async (req, res) => {
        console.log('175: list controller addcontactstolist')
        if (req.headers && req.headers.authorization) { 
            var list 
            var sender; 
            // list: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newlist
            try {
                list = await List.findOne({_id:req.body.list_id});
            } catch (error) {
                console.log('error in notification findbyId')
                console.log(error)
            }
            for (let i = 0; i < req.body.contacts.length; i++) {
                const element = req.body.contacts[i];
                try {
                    sender = await User.findById(element);
                } catch (error) {
                    console.log('error in User  findById')
                    console.log(error)
                }
                if(!list.contacts.includes(sender._id)){
                    list.contacts.push(sender)
                }
            }
             try {
                await list.save();
            } catch (error) {
                console.log('error in notification save')
                console.log(error)
            }
            return res.status(200).json({
                msg: "Contacts added to list",
                result: true,
                details: list
            })
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('accept friend request unauthorized');
        }
    },

    removeContactsToList: async (req, res) => {
        console.log('217: list controller removecontactstolist')
        if (req.headers && req.headers.authorization) { 
            var list 
            var sender; 
            // list: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newlist

            for (let i = 0; i < req.body.contacts.length; i++) {
                const element = req.body.contacts[i]; 
                try {
                    list = await List.findOneAndUpdate({"_id":req.body.list_id},
                    {$pull:{'contacts':element}}
                    ).exec();
                } catch (error) {
                    console.log("\n")
                    console.log('231 list controller :error in removing from list  ')
                    console.log(error)
                    console.log("\n")                
                    return res.status(200).json({
                        msg: "error",
                        result: false,
                        error:error
                    });
                }
          
            }
             try {
                await list.save();
            } catch (error) {
                console.log('error in notification save')
                console.log(error)
            }
            return res.status(200).json({
                msg: "Contacts removed from list",
                result: true,
                details: list
            })
        } else {
            console.log('no headers 51 ')
            return res.status(401).send('accept friend request unauthorized');
        }
    },

    rejectEventInvite: async (req, res) => {
        console.log('reject event invite')
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
            var event;
            var receiver;
            var sender;

            // notification: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newNotification
            try {
                notification = await Notification.findById(req.body.notification_id);
            } catch (error) {
                console.log('error in notification findbyId')
                console.log(error)
            }
            sender_id = notification.sender;
            receiver_id = notification.receiver;
            try {
                event = await Event.findById(req.params.event_id);
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

            //now sender is : WHO SENT THE INVITE
            //reciever is me: currently loggedin user

            try {
                sender = await User.findById(sender_id);
            } catch (error) {
                console.log('error in User  findById')
                console.log(error)
            }
            try {
                receiver = await User.findById(receiver_id);
            } catch (error) {
                console.log('error in User  findById')
                console.log(error)
            }

            if (receiver.events.includes(req.params.event_id)) {
                console.log(receiver)
                return res.status(200).json({
                    msg: "Invitation  Already Accepted",
                    result: true,
                    details: null
                })
            } else {
                var rejectedInvited;
                //UPDATE THE FRIEND REQUEST STATUS
                try {
                    rejectedInvited = await EventInvite.findOneAndUpdate({ sender: sender_id, receiver: receiver_id }, { status: "rejected" });
                } catch (error) {
                    console.log('error in friendrequest  findoneandupdate')
                    console.log(error)
                }

                // ACCEPT EVENT ------ PUSH EVENT INTO receiver
                receiver.events.push(event)

                const newNotification = new Notification({
                    sender: receiver_id,
                    receiver: sender_id,
                    detail: receiver.name + " rejected your event invite",
                    seen: false,
                    type: 'normal'
                })

                newNotification.sender = receiver;
                newNotification.receiver = sender;

                try {
                    await receiver.save();
                } catch (error) {
                    console.log('281 eventcontroller error in save receiver')
                    console.log(error)
                }
                try {
                    await newNotification.save();
                } catch (error) {
                    console.log('error in newnotification save')
                    console.log(error)
                }

                //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
                try {
                    sender.notifications.push(newNotification);
                    await sender.save();
                    sender.save()

                    return res.status(200).json({
                        msg: "event invite unsubscribed",
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

    getEventByID: async (req, res) => {
        console.log('get event by notification id')
        console.log("req.params")
        console.log(req.params)
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            var decoded;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (error) {
                console.log('error in verify jwt')
                console.log(error)
            }
            var event;
            try {
                event = await Event.findById(req.params.event_id).populate('attendees')
            } catch (error) {
                console.log('error in event findbyId')
                console.log(error)
            }

            return res.status(200).json({
                result: true,
                details: event,
                msg: 'events'
            })
        }
    },
    // used in : contactlists/contact
    getAllUsers: async (req, res) => {
        console.log('488: eventcontroller get all users')
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
