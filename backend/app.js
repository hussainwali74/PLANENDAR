//GITHUB PUBLIC REPOSITORY COPY
//Imports
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");

const cors = require("cors");
const path = require("path");
//Creation of Express App
const app = express();
app.use(morgan("tiny"));

app.use(express.static(__dirname + "/public"));

//Connecting to Mongoose (Place your MongoDB connection string here)
mongoose
  .connect("mongodb://localhost:27017/planendar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Shaw.");
  })
  .catch((error) => {
    console.log("Connection Failed: " + error);
  });

// // WIPE OUT DATABASE MODELS
// const User = require("./models/user.model");
// User.remove({}, () => {});
// const Notification = require("./models/notification.model");
// Notification.remove({}, () => {});
// const FriendRequest = require("./models/request.model");
// FriendRequest.remove({}, () => {});
// const EventInvites = require("./models/EventInvite.model");
// EventInvites.remove({}, () => {});
// const Event = require("./models/event.model");
// Event.remove({}, () => {});

const bodyParser = require("body-parser");
//CORS ERROR PATCH
app.use(cors());

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
// app.use(
//   bodyParser.urlencoded({
//     parameterLimit: 100000,
//     limit: "50mb",
//     extended: true,
//   })
// );
// app.use(bodyParser.json({ limit: "50mb" }));

//========================================================================
//  ROUTES
//========================================================================

//AUTH ROUTES
app.get("/hussain", (req, res, next) => {
  console.log("hussainshelo");
  res.send("hello");
});
console.log("kljkjlkjlkj");
app.use("/auth", require("./routes/auth.route"));
//API ROUTES
app.use("/api", require("./routes/event.route"));
//========================================================================

//Angular App Hosting Production Build
// app.use(express.static(__dirname + '/dist/login'));

// For all GET requests, send back index.html (PathLocationStrategy) (Refresh Error)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/dist/login/index.html'));
// });

app.use("/*", (req, res, next) => {
  res.status(400).json({
    msg: "Link is Incorrect..!!",
  });
  next();
});
//Exporting Express app for importing in node server script
module.exports = app;
