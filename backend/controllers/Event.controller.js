const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const FriendRequest = require("../models/request.model");
const Notification = require("../models/notification.model");
const EventInvite = require("../models/EventInvite.model");
const Event = require("../models/event.model");

module.exports = {
  //@desc Create event
  //@route post /api/create-event
  createEvent: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
      var email = decoded.email;
      // Fetch the user by id
      var user;
      try {
        user = await User.findOne({ email: email });
      } catch (error) {
        console.log("33: event route: error createevent");
        console.log(error);
      }
      const event = new Event({
        title: req.body.title,
        date: req.body.date,
        user_id: user._id,
        creator: user._id,
        time: req.body.time,
        description: req.body.description,
        privacity: req.body.privacity,
        extra_fields: req.body.extra_fields,
      });
      user.createdevents.push(event);
      try {
        await user.save();
      } catch (error) {
        console.log("error in save new event");
        console.log(error);
        return res.status(401).json({
          msg: "Could not create the event Please try again",
          result: "false",
        });
      }
      event.creator = user;
      try {
        await event.save();
      } catch (error) {
        console.log("error in save new event");
        console.log(error);
        return res.status(401).json({
          msg: "Could not create the event Please try again",
          result: "false",
        });
      }
      res.status(201).json({
        result: true,
        msg: "Event Created successfully",
        details: event,
      });
    } else {
      console.log("no headers 51 ");
    }
  },

  //POST
  // /api/block-event-invites
  // block event invitation to contacts
  blockEventInvites: async (req, res) => {
    var alreadyBlocked = [];
    var currentBlocked = [];
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (e) {
        console.log("autherizing jwt");
        console.log(e);
        return res.status(401).send("unauthorized");
      }
      var sender_id;
      var receiver_id;
      try {
        sender = await User.findOne({ email: decoded.email });
      } catch (error) {
        console.log("error in finding sender");
        console.log(error);
      }
      sender_id = sender._id;
      var event;
      try {
        event = await Event.findOne({ _id: req.body.event_id });
      } catch (error) {
        console.log("error finding event");
        console.log(error);
      }
      for (let index = 0; index < req.body.receivers.length; index++) {
        receiver_id = req.body.receivers[index];

        let receiver;
        try {
          receiver = await User.findById(receiver_id);
        } catch (error) {
          console.log("find user");
          console.log(error);
        }
        if (event.blocked) {
          if (event.blocked.includes(receiver_id)) {
            alreadyBlocked.push(receiver["name"]);
          } else {
            event.blocked.push(receiver);
            currentBlocked.push(receiver["name"]);
            try {
              await event.save();
            } catch (error) {
              console.log("error in save blocked list event");
              console.log(error);
            }
          } //END - ELSE EVENT.LENGTH==0
        } else {
          console.log("---------------------event");
          console.log(event);
        }
      } //END - FOR
    }
    let details = {};
    details["alreadyBlocked"] = alreadyBlocked;
    details["currentBlocked"] = currentBlocked;
    return res.status(200).json({
      msg: "Event Invitations Sent ",
      result: true,
      details: details,
    });
  },
  //POST
  // /api/send-event-invites
  // send event invitation to contacts
  sendEventInvites: async (req, res) => {
    const event_id = req.body.event_id;
    var alreadyInvited = [];
    var currentInvited = [];
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (e) {
        console.log("autherizing jwt");
        console.log(e);
        return res.status(401).send("unauthorized");
      }

      var eventInvite;
      var sender_id;
      var receiver_id;
      try {
        sender = await User.findOne({ email: decoded.email });
      } catch (error) {
        console.log("error in finding sender");
        console.log(error);
      }
      sender_id = sender._id;
      var event;

      try {
        event = await Event.findOne({ _id: req.body.event_id });
      } catch (error) {
        console.log("error finding event");
        console.log(error);
      }

      for (let index = 0; index < req.body.receivers.length; index++) {
        receiver_id = req.body.receivers[index];

        try {
          eventInvite = await EventInvite.find({
            receiver: receiver_id,
            event: event_id,
          }).populate("receiver");
        } catch (error) {
          console.log("find user");
          console.log(e);
        }
        try {
          receiver = await User.findOne({ _id: receiver_id });
        } catch (error) {
          console.log("error finding receiver");
          console.log(error);
        }

        if (eventInvite) {
          if (eventInvite.length != 0) {
            console.log("WHEN EVENTinvite.LENGGTH==0");
            console.log(eventInvite);
            alreadyInvited.push(eventInvite["0"]["receiver"]["name"]);
          } else {
            event.invitees.push(receiver_id);
            const newInvite = new EventInvite({
              sender: sender_id,
              receiver: receiver_id,
              event: event._id,
            });
            newInvite.sender = sender;
            newInvite.receiver = receiver;
            newInvite.event = event;

            try {
              saveInvite = await newInvite.save();
              await event.save();
            } catch (error) {
              console.log("error in save new request");
              console.log(error);
            }

            const newNotification = new Notification({
              receiver: receiver_id,
              sender: sender_id,
              detail: sender.name + " has invited you to event: " + event.title,
              type: "eventinvite",
              event: event._id,
            });

            newNotification.receiver = receiver;
            newNotification.sender = sender;
            newNotification.event = event;

            try {
              await newNotification.save();
            } catch (error) {
              console.log("error in save notification");
              console.log(error);
            }
            receiver.notifications.push(newNotification);
            receiver.eventinvites.push(newInvite);

            try {
              await receiver.save();
              currentInvited.push(receiver.name);
            } catch (error) {
              console.log("error in save receiver");
              console.log(error);
            }
          } //END - ELSE EVENT.LENGTH==0
        } else {
          console.log(
            "=============================================================="
          );
          console.log("ERROR eventInvite null");
          console.log(
            "=============================================================="
          );
        }
      } //END - FOR
    }
    let details = {};
    details["alreadyinvited"] = alreadyInvited;
    details["currentInvited"] = currentInvited;
    return res.status(200).json({
      msg: "Event Invitations Sent ",
      result: true,
      details: details,
    });
  },

  updateEvent: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
      // Fetch the user by id
      var event;
      try {
        event = await Event.findById(req.params.event_id);
      } catch (error) {
        console.log("eventcontroller: error get event by id 147");
        console.log(error);
      }
      event.title = req.body.title;
      event.date = req.body.date;
      // event.user_id = req.body.user_id
      event.time = req.body.time;
      event.date = req.body.date;
      event.description = req.body.description;
      event.privacity = req.body.privacity;
      event.extra_fields = req.body.extra_fields;
      event.edited = true;
      try {
        event = await event.save();
      } catch (error) {
        console.log("eventcontroller: error save event 159");
        console.log(error);
      }
    }

    res.status(201).json({
      result: true,
      msg: "Event updated successfully",
      details: event,
    });
  },
  //post method
  notificationSeen: async (req, res) => {
    console.log(req.body);
    try {
      notification = await Notification.findById(req.body.notification_id);
    } catch (error) {
      console.log("error in notification findbyId");
      console.log(error);
    }
    notification.seen = true;
    try {
      await notification.save();
    } catch (error) {
      console.log("error in notification save");
      console.log(error);
    }
    return res.status(200).json({
      msg: "event invite accepted",
      result: true,
      details: null,
    });
  },

  acceptEventInvite: async (req, res) => {
    console.log("acceptttt event invite");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;

      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }

      var notification;
      var sender_id;
      var receiver_id;
      var event;
      var receiver;
      var sender;

      // notification: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newNotification
      try {
        notification = await Notification.findById(req.body.notification_id);
      } catch (error) {
        console.log("error in notification findbyId");
        console.log(error);
      }
      notification.seen = true;
      try {
        await notification.save();
      } catch (error) {
        console.log("error in notification save");
        console.log(error);
      }
      console.log("notification");
      console.log(req.body);
      sender_id = notification.sender;
      receiver_id = notification.receiver;
      try {
        event = await Event.findById(req.params.event_id);
      } catch (error) {
        console.log("error in notification findbyId");
        console.log(error);
      }

      //now sender is : WHO SENT THE INVITE
      //reciever is me: currently loggedin user

      try {
        sender = await User.findById(sender_id);
      } catch (error) {
        console.log("error in User  findById");
        console.log(error);
      }
      try {
        receiver = await User.findById(receiver_id);
      } catch (error) {
        console.log("error in User  findById");
        console.log(error);
      }

      if (receiver.events.includes(req.params.event_id)) {
        let eventinvite = await EventInvite.findOne({
          event: req.params.event_id,
        });

        await User.findOneAndUpdate(
          { _id: receiver_id },
          { $pull: { eventinvites: eventinvite._id } }
        ).exec();

        try {
          await Event.findOneAndUpdate(
            { _id: req.params.event_id },
            { $pull: { invitees: receiver_id } }
          ).exec();
        } catch (error) {
          console.log(
            "689 event controller error in update event remove invitee"
          );
          console.log(error);
          res.status(400).json({
            msg: "error in update event remove invitee",
            error: error,
          });
        }

        return res.status(200).json({
          msg: "Invitation  Already Accepted",
          result: true,
          details: null,
        });
      } else {
        //UPDATE THE FRIEND REQUEST STATUS
        try {
          await EventInvite.findOneAndUpdate(
            { sender: sender_id, receiver: receiver_id },
            { status: "accepted" }
          );
        } catch (error) {
          console.log("error in friendrequest  findoneandupdate");
          console.log(error);
        }

        await Event.findOneAndUpdate(
          { _id: req.params.event_id },
          { $pull: { invitees: receiver_id } }
        ).exec();

        try {
          event.attendees.push(receiver);
          await event.save();
          //  await event.attendees.pus({ sender: sender_id, receiver: receiver_id }, { status: "accepted" });
        } catch (error) {
          console.log("error in save event attendees ");
          console.log(error);
        }

        let eventinvite = await EventInvite.findOne({
          event: req.params.event_id,
        });

        await User.findOneAndUpdate(
          { _id: receiver_id },
          { $pull: { eventinvites: eventinvite._id } }
        ).exec();

        // ACCEPT EVENT ------ PUSH EVENT INTO receiver
        receiver.events.push(event);

        const newNotification = new Notification({
          sender: receiver_id,
          receiver: sender_id,
          detail: receiver.name + " accepted event invite",
          seen: false,
          type: "normal",
        });

        newNotification.sender = receiver;
        newNotification.receiver = sender;
        console.log(
          "receiverrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"
        );
        try {
          await receiver.save();
        } catch (error) {
          console.log("281 eventcontroller error in save receiver");
          console.log(error);
        }
        try {
          await newNotification.save();
        } catch (error) {
          console.log("error in newnotification save");
          console.log(error);
        }

        //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
        try {
          sender.notifications.push(newNotification);
          await sender.save();
          sender.save();

          return res.status(200).json({
            msg: "event invite accepted",
            result: true,
            details: null,
          });
        } catch (e) {
          console.log("e===========================");
          console.log(e);
          return res.status(401).send("unauthorized");
        }
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("accept friend request unauthorized");
    }
  },

  unSubscribeEventInvite: async (req, res) => {
    console.log("unsub to event invite");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      var user;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
        user = await User.findOne({ email: decoded.email });
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }

      const userId = user._id;
      var event;
      var receiver;
      var sender;

      try {
        event = await Event.findById(req.params.event_id);
      } catch (error) {
        console.log("error in notification findbyId");
        console.log(error);
      }

      //REMOVE USER FROM EVENT.ATTENDEES
      console.log("-----------------------------------------------------");
      console.log("userid");
      console.log(event);
      console.log("-----------------------------------------------------");
      try {
        await User.findOneAndUpdate(
          { _id: receiver_id },
          { $pull: { eventinvites: req.params.event_id } }
        ).exec();

        await Event.findOneAndUpdate(
          { _id: req.params.event_id },
          { $pull: { invitees: receiver_id } }
        ).exec();
      } catch (error) {
        console.log(
          "536 event controller error in update event remove invitee"
        );
        console.log(error);
        res.status(400).json({
          msg: "error in update event remove invitee",
          error: error,
        });
      }

      if (event.attendees.includes(userId)) {
        let eventt = await Event.findOneAndUpdate(
          { _id: req.params.event_id },
          { $pull: { attendees: userId } }
        ).exec();
      }
      event.eliminated.push(user);
      //REMOVE EVENT FROM USER.EVENTS
      await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { events: req.params.event_id } }
      ).exec();

      try {
        receiver = await User.findById(event.creator);
      } catch (error) {
        console.log("475 eventcontroller error in get receiver");
        console.log(error);
      }
      const newNotification = new Notification({
        sender: userId,
        receiver: event.creator,
        detail: user.name + " unsubscribed to your event",
        seen: false,
        type: "normal",
      });

      newNotification.sender = receiver;
      newNotification.receiver = sender;
      try {
        await event.save();
        await newNotification.save();
      } catch (error) {
        console.log("error in newnotification save");
        console.log(error);
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("accept friend request unauthorized");
    }
  },

  rejectEventInvite: async (req, res) => {
    console.log("605 REJECT  event invite");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      var notification;
      var sender_id;
      var receiver_id;
      var event;
      var receiver;
      var sender;

      // notification: RECEIVER IS LOGGED IN USER, HE WILL BE NOW THE SENDER FOR newNotification
      try {
        notification = await Notification.findById(req.body.notification_id);
      } catch (error) {
        console.log("error in notification findbyId");
        console.log(error);
      }
      sender_id = notification.sender;
      receiver_id = notification.receiver;
      try {
        event = await Event.findById(req.params.event_id);
      } catch (error) {
        console.log("error in notification findbyId");
        console.log(error);
      }
      notification.seen = true;
      try {
        await notification.save();
      } catch (error) {
        console.log("error in notification save");
        console.log(error);
      }

      //now sender is : WHO SENT THE INVITE
      //reciever is me: currently loggedin user

      try {
        sender = await User.findById(sender_id);
      } catch (error) {
        console.log("error in User  findById");
        console.log(error);
      }
      try {
        receiver = await User.findById(receiver_id);
      } catch (error) {
        console.log("error in User  findById");
        console.log(error);
      }

      await Event.findOneAndUpdate(
        { _id: req.params.event_id },
        { $pull: { invitees: receiver_id } }
      ).exec();
      if (receiver.events.includes(req.params.event_id)) {
        await User.findOneAndUpdate(
          { _id: receiver_id },
          { $pull: { events: req.params.event_id } }
        ).exec();

        receiver.rejected_events.push(event);
        await receiver.save();
        // event.eliminated.push(user);

        let eventt = await Event.findOneAndUpdate(
          { _id: req.params.event_id },
          { $pull: { attendees: receiver._id } }
        ).exec();

        event.eliminated.push(receiver);
        await event.save();

        return res.status(200).json({
          msg: "Unsubscribed from the event",
          result: true,
          details: event,
        });
      } else {
        var rejectedInvited;
        //UPDATE THE FRIEND REQUEST STATUS
        try {
          rejectedInvited = await EventInvite.findOneAndUpdate(
            { sender: sender_id, receiver: receiver_id },
            { status: "rejected" }
          );
        } catch (error) {
          console.log("error in friendrequest  findoneandupdate");
          console.log(error);
        }

        const newNotification = new Notification({
          sender: receiver_id,
          receiver: sender_id,
          detail: receiver.name + " rejected your event invite",
          seen: false,
          type: "normal",
        });

        newNotification.sender = receiver;
        newNotification.receiver = sender;

        try {
          await receiver.save();
        } catch (error) {
          console.log("281 eventcontroller error in save receiver");
          console.log(error);
        }
        try {
          await Event.findOneAndUpdate(
            { _id: req.params.event_id },
            { $pull: { invitees: receiver_id } }
          ).exec();
        } catch (error) {
          console.log(
            "689 event controller error in update event remove invitee"
          );
          console.log(error);
          res.status(400).json({
            msg: "error in update event remove invitee",
            error: error,
          });
        }

        try {
          await newNotification.save();
        } catch (error) {
          console.log("error in newnotification save");
          console.log(error);
        }

        //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
        try {
          let event = await Event.findOne({ _id: req.params.event_id });
          event.eliminated.push(receiver);
          console.log(
            "=========================================================="
          );
          console.log("event");
          console.log(event);
          console.log(
            "=========================================================="
          );
          await event.save();
          receiver.rejected_events.push(event);
          sender.notifications.push(newNotification);
          await sender.save();
          sender.save();
          return res.status(200).json({
            msg: "event invite unsubscribed",
            result: true,
            details: null,
          });
        } catch (e) {
          console.log("e===========================");
          console.log(e);
          return res.status(401).send("unauthorized");
        }
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("accept friend request unauthorized");
    }
  },
  // Get My Events ... events which user is going to
  getMySubscribedEvents: async (req, res) => {
    console.log("647: event controller: get my subscribed events");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      const event = await Event.find({ attendees: decoded._id });
      return res.status(200).json({
        result: true,
        details: event,
        msg: "My Subscribed Events",
      });
    }
  },
  // Get My Events ... events which user is going to
  getMyCalenderEvents: async (req, res) => {
    console.log("670: event controller: get my events");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      var userId;
      const user = await User.findOne({ email: decoded.email }).populate(
        "events"
      );
      var events = await Event.find({ attendees: user._id }).populate(
        "creator"
      );
      return res.status(200).json({
        result: true,
        details: events,
        msg: "My Events",
      });
    }
  },
  // Get My Events ... events which user is going to
  getMyEvents: async (req, res) => {
    console.log("670: event controller: get my events");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      var userId;
      const user = await User.findOne({ email: decoded.email }).populate(
        "events"
      );
      return res.status(200).json({
        result: true,
        details: user,
        msg: "My Events",
      });
    }
  },
  // Get My Events ... events which user is going to
  getMyCreatedEvents: async (req, res) => {
    console.log("690: event controller: get my created events");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      const user = await User.findOne({ email: decoded.email });

      const events = await Event.find({ creator: user._id }).populate(
        "creator"
      );
      return res.status(200).json({
        result: true,
        details: events,
        msg: "My Events",
      });
    }
  },
  // Get all Events
  getAllEvents: async (req, res) => {
    console.log("670: event controller: get all events");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      var events;
      try {
        events = await Event.find({ privacity: "public" })
          .populate("attendees")
          .populate("creator")
          .populate("user_id");
      } catch (error) {
        console.log("error in event findbyId");
        console.log(error);
      }

      return res.status(200).json({
        result: true,
        details: events,
        msg: "All Events",
      });
    }
  },
  getEventByID: async (req, res) => {
    console.log("get event by notification id");
    console.log("req.params");
    console.log(req.params);
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
      }
      var event;
      try {
        event = await Event.findById(req.params.event_id)
          .populate("attendees")
          .populate("blocked")
          .populate("eliminated")
          .populate("confirmed");
      } catch (error) {
        console.log("error in event findbyId");
        console.log(error);
      }

      return res.status(200).json({
        result: true,
        details: event,
        msg: "events",
      });
    }
  },
  // used in : contactlists/contact
  getAllUsers: async (req, res) => {
    console.log("488: eventcontroller get all users");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (e) {
        console.log("autherizing jwt");
        console.log(e);
        return res.status(401).send("unauthorized");
      }
      var email = decoded.email;
      try {
        // ===================================================================================
        const users = await User.find({ email: { $ne: email } }).populate(
          "friends"
        );
        users.map((user) => {
          user.email, user.name, user.photo ? user.photo : "-", user.id;
        });
        // ===================================================================================
        return res.status(200).json({
          msg: "all users list",
          details: users,
          result: true,
        });
      } catch (error) {
        console.log("error getting your friend:", error);
        res.status(500).send(error);
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("unauthorized");
    }
  },

  acceptFriendRequests: async (req, res) => {
    console.log("acceptttt");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
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
        console.log("error in notification findbyId");
        console.log(error);
      }

      var sender;
      var receiver;

      try {
        sender = await User.findById(receiver_id);
      } catch (error) {
        console.log("error in User  findById");
        console.log(error);
      }

      if (sender.friends.includes(sender_id)) {
        console.log(sender);
        return res.status(200).json({
          msg: "Friend Request Already Accepted",
          result: true,
          details: null,
        });
      } else {
        console.log("=-====================else");
        var acceptedFriendRequest;
        //UPDATE THE FRIEND REQUEST STATUS
        try {
          acceptedFriendRequest = await FriendRequest.findOneAndUpdate(
            { sender: sender_id, receiver: receiver_id },
            { status: "accepted" }
          );
        } catch (error) {
          console.log("error in friendrequest  findoneandupdate");
          console.log(error);
        }

        try {
          sender.friends.push(receiver);
          receiver.friends.push(sender);
        } catch (error) {
          console.log("error in User receiver findById");
          console.log(error);
        }

        const newNotification = new Notification({
          sender: receiver_id,
          receiver: sender_id,
          detail: sender.name + " accepted your Friend Request",
          seen: false,
          type: "normal",
        });

        newNotification.sender = sender;
        newNotification.receiver = receiver;

        try {
          await newNotification.save();
        } catch (error) {
          console.log("error in newnotification save");
          console.log(error);
        }
        //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
        try {
          receiver.notifications.push(newNotification);
          await receiver.save();
          sender.save();

          return res.status(200).json({
            msg: "Friend Request Accepted",
            result: true,
            details: null,
          });
        } catch (e) {
          console.log("e===========================");
          console.log(e);
          return res.status(401).send("unauthorized");
        }
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("accept friend request unauthorized");
    }
  },

  rejectFriendRequests: async (req, res) => {
    console.log("rejeccct");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      var decoded;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (error) {
        console.log("error in verify jwt");
        console.log(error);
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
        console.log("error in notification findbyId");
        console.log(error);
      }
      var acceptedFriendRequest;
      //UPDATE THE FRIEND REQUEST STATUS
      try {
        acceptedFriendRequest = await FriendRequest.findOneAndUpdate(
          { sender: sender_id, receiver: receiver_id },
          { status: "rejected" }
        );
      } catch (error) {
        console.log("error in friendrequest  findoneandupdate");
        console.log(error);
      }
      var sender;
      var receiver;
      try {
        sender = await User.findById(receiver_id);
      } catch (error) {
        console.log("error in User  findById");
        console.log(error);
      }
      try {
        receiver = await User.findById(sender_id);
      } catch (error) {
        console.log("error in User receiver findById");
        console.log(error);
      }
      const newNotification = new Notification({
        sender: receiver_id,
        receiver: sender_id,
        detail: sender.name + " rejected your Friend Request",
        seen: false,
        type: "normal",
      });
      newNotification.sender = sender;
      newNotification.receiver = receiver;
      try {
        await newNotification.save();
      } catch (error) {
        console.log("error in newnotification save");
        console.log(error);
      }
      //ADD THE NEW NOTIFICATION TO RECEIVER'S NOTIFICATIONS ARRAY
      try {
        receiver.notifications.push(newNotification);
        await receiver.save();
        res.status(200).json({
          msg: "Friend Request Accepted",
          result: true,
          details: null,
        });
      } catch (e) {
        console.log("e===========================");
        console.log(e);
        return res.status(401).send("unauthorized");
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("accept friend request unauthorized");
    }
  },

  getFriendRequests: async (req, res) => {
    console.log("get friend requests");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
        var userId;
        const user = await User.findOne({ email: decoded.email }).populate(
          "friendrequests"
        );
        userId = user._id;
        const friendRequests = await FriendRequest.find({
          receiver: userId,
        }).populate("sender");
        res.status(200).json({
          msg: "friendrequests",
          result: true,
          details: friendRequests,
        });
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("unauthorized");
    }
  },
  getFriends: async (req, res) => {
    console.log("get friends of loggedin user");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
        var userId;
        const user = await User.findOne({ email: decoded.email }).populate(
          "friends"
        );
        userId = user._id;
        // const friendRequests = await FriendRequest.find({ receiver: userId }).populate('sender');
        res.status(200).json({
          msg: "friendrequests",
          result: true,
          details: user,
        });
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
    } else {
      console.log("no headers 51 ");
      return res.status(401).send("unauthorized");
    }
  },

  sendFriendRequest: async (req, res, next) => {
    console.log("send friend requests");
    const { receiver_id } = req.body;
    var receiver;

    try {
      receiver = await User.findOne({ _id: receiver_id });
    } catch (error) {
      console.log("error finding receiver");
      console.log(error);
    }
    var authorization = req.headers.authorization;
    if (req.headers && req.headers.authorization) {
      decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      var senderId;
      var sender;
      try {
        sender = await User.findOne({ email: decoded.email });
      } catch (error) {
        console.log("error in finding sender");
        console.log(error);
      }
      senderId = sender._id;
      var friendRequests;
      try {
        friendRequests = await FriendRequest.find({
          sender: senderId,
          receiver: receiver_id,
        })
          .populate("receiver")
          .populate("sender");
      } catch (error) {
        console.log("error in finding friend requests 196");
        console.log(error);
      }
      if (friendRequests) {
        if (friendRequests.length != 0) {
          console.log("friendRequests");
          console.log(friendRequests);
          return res.status(200).json({
            msg: "Friend Request already sent",
            result: false,
          });
        } else {
          const newfriendRequest = new FriendRequest({
            sender: senderId,
            receiver: receiver_id,
            status: "pending",
          });
          newfriendRequest.receiver = receiver;
          let savedRequest;
          try {
            savedRequest = await newfriendRequest.save();
          } catch (error) {
            console.log("error in save new request");
            console.log(error);
          }
          const newNotification = new Notification({
            receiver: receiver_id,
            sender: senderId,
            detail: sender.name + " has sent you friend request",
            type: "friendrequest",
          });
          newNotification.receiver = receiver;
          newNotification.sender = sender;
          try {
            await newNotification.save();
          } catch (error) {
            console.log("error in save notification");
            console.log(error);
          }
          receiver.friendrequests.push(newfriendRequest);
          receiver.notifications.push(newNotification);
          try {
            await receiver.save();
          } catch (error) {
            console.log("error in save receiver");
            console.log(error);
          }
          return res.status(200).json({
            msg: "Friend Request  sent",
            result: false,
          });
        }
      } else {
        console.log(
          "=============================================================="
        );
        console.log("ERROR friendRequests null");
        console.log(
          "=============================================================="
        );
      }
    }
  },
};
