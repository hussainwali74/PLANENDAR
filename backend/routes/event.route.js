const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const Event = require("../models/event.model");
const User = require("../models/user.model");
const Connect = require("../controllers/Connection.controller");
const AuthController = require("../controllers/Auth.controller");
const EventController = require("../controllers/Event.controller");

const ProfileController = require("../controllers/Profile.controller");
const ListController = require("../controllers/List.controller");

require("dotenv").config();

//@desc View User created event
//@route post /api/view-user-event
router.get("/view-user-events", (req, res, next) => {
  console.log("view event");
  var userId;
  var x = jwt.verify(req.headers.authorization, process.env.EMAIL_SECRET);
  User.findOne({ email: x.email }).then((docs) => {
    userId = docs._id;
    Event.find({ user_id: userId }).then((docs) => {
      // console.log(docs)
      return res.status(200).json({
        msg: "events created by the user",
        details: docs,
        result: true,
      });
    });
  });
});
// ===========================================================================
//             event related end points
// ===========================================================================
router.post("/create-event", EventController.createEvent);
router.get("/get-event/:event_id", EventController.getEventByID);
router.get("/get-all-events", EventController.getAllEvents);
router.get("/get-calender-events", EventController.getMyCalenderEvents);
router.get("/get-my-events", EventController.getMyEvents);
router.get("/get-my-created-events", EventController.getMyCreatedEvents);
router.get("/get-my-subscribed-events", EventController.getMySubscribedEvents);
router.get("/get-event-invites", Connect.getAllUsers);
router.post("/send-event-invites", EventController.sendEventInvites);
router.post("/block-event-invites", EventController.blockEventInvites);
router.put("/update-event/:event_id", EventController.updateEvent);
router.post(
  "/accept-event-invite/:event_id",
  EventController.acceptEventInvite
);
router.post(
  "/reject-event-invite/:event_id",
  EventController.rejectEventInvite
);
router.post(
  "/unsubscribe-event-invite/:event_id",
  EventController.unSubscribeEventInvite
);
router.post("/notification_see", EventController.notificationSeen);

// ===========================================================================

// ===========================================================================
//              Contact List end points
// ===========================================================================
router.post("/create-list", ListController.createList);
router.post("/delete-list", ListController.deleteList);
router.post("/add-list-contacts", ListController.addContactsToList);
router.post("/remove-list-contacts", ListController.removeContactsToList);
router.get("/get-my-lists", ListController.getMyLists);
// router.get('/get-lists', ListController.sendEventInvites)
router.get("/get-list/:list_id", ListController.getListDetails);
// router.put('/update-list/:list_id', ListController.sendEventInvites)

// ===========================================================================

// ===========================================================================
//              friend requests etc
// ===========================================================================
router.get("/get-users", Connect.getAllUsers);
router.post("/friend-request", Connect.sendFriendRequest);
router.post("/cancel-friend-request", Connect.cancelFriendRequest);
router.post("/unfriend", Connect.unFriend);
router.get("/friend-requests", Connect.getFriendRequests);
router.get("/get-friends", Connect.getFriends);
router.put("/accept-friend-request", Connect.acceptFriendRequests);
router.put("/reject-friend-request", Connect.rejectFriendRequests);

// ===========================================================================

// ===========================================================================
//              profile
// ===========================================================================
router.get("/get-profile", ProfileController.getProfile);
router.get("/get-notifications", ProfileController.getNotifications);
router.put("/update-profile", ProfileController.updateProfile);
router.put("/save-profile-pic", AuthController.saveProfilePic);
router.get(
  "/get-new-notification-count",
  ProfileController.getNotificationCount
);

// ===========================================================================

module.exports = router;
