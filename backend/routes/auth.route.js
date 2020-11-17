const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var expressjwt = require("express-jwt");
const bcrypt = require("bcryptjs");

//MODELS
const User = require("../models/user.model");

// CONTROLLERS
const AuthController = require("../controllers/Auth.controller");

const nodemailer = require("nodemailer");
require("dotenv").config();

const path = require("path");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

var auth = expressjwt({
  secret: "MY_SECRET",
  userProperty: "payload",
  algorithms: ["RS256"],
});

//@desc Auth with Google
//@route Get /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@desc google auth callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("res  got");
    res.send("/dashboard");
  }
);

// @desc Logout User
// @route /auth/logout
router.get("/logout", (req, res) => {
  req.logout(); //since we are using passport it provides this logout method in request
  res.redirect("/");
});

//Login Validation with Credentials and Issue token hhh
router.post("/login", (req, res, next) => {
  console.log("56: authroute login");
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          msg: "User not founds, please register !",
          result: result,
        });
      }
      if (!result.confirmed) {
        return res.status(401).json({
          msg: "Please  confirm your email to login",
          result: "false",
        });
      }
      fetchedUser = result;
      return bcrypt.compare(req.body.password, result.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          msg: "email, password don't match, please try again!",
          result: "false",
        });
      } else {
        //Creation of Token Since Credentials are matched
        if (fetchedUser) {
          const payload = {
            email: fetchedUser.email,
          };
          //Secret key to issue JWT token
          const token = jwt.sign(payload, process.env.EMAIL_SECRET, {
            expiresIn: "1h",
          });
          //Sending Token
          return res.status(200).json({
            msg: "Welcome Back..!!",
            token: token,
            user: fetchedUser,
            result: "true",
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        msg: "Authorization Failed..!!",
        result: "false",
      });
    });
});
router.post("/signup", AuthController.signUp);

// @DESC: send forgot password link
// ROUTE: /auth/forgot-password

router.post(
  "/forgot-password",
  (req, res, next) => {
    var user;
    var tok;
    User.findOne({ email: req.body.email }).then((result) => {
      user = result;
      var emailSent = false;
      //sync email sending
      try {
        const emailToken = jwt.sign(
          { user: _.pick(user, "id") },
          process.env.EMAIL_SECRET,
          { expiresIn: "1d" }
        );
        tok = emailToken;
        const url = `${process.env.BACK_URL}:${process.env.PORT}/auth/updatepassword/${emailToken}`;
        // const url = `http://localhost:3000/auth/updatepassword/${emailToken}`;
        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });
        transporter.sendMail(
          {
            from: process.env.EMAIL_FROM,
            // to: 'hussain.akhss2010@gmail.com ',
            to: req.body.email,
            subject: "PLANENDAR | Reset Password",
            // text: 'hello world!'
            html: `
            <h3>Please click the link below to reset your password</h3>
            <hr>
            <a href="${url}">${url}</a>
          `,
          },
          (error, info) => {
            if (error) {
              return console.log(error);
            }
            emailSent = true;
            console.log("Message sent: %s", info.messageId);
            console.log(emailSent);
            res.status(201).json({
              result: true,
              details: "email sent",
              emailSent: emailSent,
            });
          }
        );
      } catch (error) {
        console.log(error);
        res.status(401).json({
          result: false,
          error: "Could not send reset link please try again later",
          emailSent: emailSent,
        });
      }
    });
  },
  (err) => {
    res.status(500).json({
      result: false,
      error: "something went wrong",
    });
  }
);

// @DESC: verify token for reset password
// ROUTE: /auth/updatepassword
router.get("/updatepassword/:token", (req, res) => {
  try {
    const {
      user: { id },
    } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    return res.redirect(
      process.env.HOST_URL + "/reset-password/" + req.params.token
    );
    // return res.redirect(
    //   "http://localhost:4200/reset-password/" + req.params.token
    // );
  } catch (error) {
    console.log("udpate password error");
    console.log(error);
    // return res.redirect(
    //   "http://ec2-18-132-13-64.eu-west-2.compute.amazonaws.com/reset-password/" +
    //     req.params.token
    // );
    return res.redirect(
      process.env.HOST_URL + "/reset-password/" + req.params.token
    );
  }
});

// @DESC:  reset password
// ROUTE: /auth/update-password
router.post("/update-password/:token", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      console.log("updating password");

      const {
        user: { id },
      } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
      User.findById(id, function (err, user) {
        if (err) return console.log(err);
        console.log("user");
        console.log(user);
        user.password = hash;
        user.save(function (err) {
          if (err) return console.log(err);
          //user has been updated
          return res.status(200).json({
            result: true,
            msg: "Password updated",
            details: "password updated successfully",
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        result: false,
        error: "could not update password",
        details: err,
      });
    });
});

//USER CLICKS ON CONFIRM EMAIL LINK email confirmed
router.get("/confirmation/:token", async (req, res) => {
  try {
    const {
      user: { id },
    } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    User.findByIdAndUpdate({ _id: id }, { confirmed: true }, (err, docs) => {
      if (err) {
        console.log("33");
        console.log(err);
        return res.send(err);
      }

      console.log("docs");
      console.log(docs);

      console.log("updated");

      // return res.redirect(
      //   "http://ec2-18-132-13-64.eu-west-2.compute.amazonaws.com/signin"
      // );
      return res.redirect(process.env.HOST_URL + "/signin");
    });
  } catch (error) {
    console.log("/confirmation: token link expired");
    return res.status(500).json({
      result: false,
      details: "the link has expired",
    });
    // res.send(error)
  }
});

//Login Validation with token for (Angular Route Guard) Note: Input Token as header
router.get(
  "/auth/validation",
  (req, res, next) => {
    console.log(req.body);
    token = req.headers.authorization;
    const secret = "kadndak#$%^&*dfreqofn2oa2141341";
    try {
      let payload = jwt.verify(token, secret);
      return res.status(200).json({
        result: true,
        payload: jwt.verify(token, secret),
      });
    } catch {
      return res.status(401).json({
        result: false,
      });
    }
  },
  (err) => {
    console.log(err);
    return res.status(500).json({
      result: false,
    });
  }
);

router.post("/save-social-login", AuthController.saveSocialLogin);
router.put("/save-profile-pic", AuthController.saveProfilePic);

module.exports = router;
