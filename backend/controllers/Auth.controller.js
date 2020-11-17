const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

const User = require("../models/user.model");

module.exports = {
  saveProfilePicture: async (req, res) => {
    let imageUrl =
      process.env.BACK_URL +
      ":" +
      process.env.port +
      "/images/" +
      req.file.filename;

    var user = await User.findById(req.params.user_id);
    if (!user.photo) {
      user.photo = imageUrl;
      try {
        await user.save();
      } catch (error) {
        console.log("\n");
        console.log(
          "==========================================================="
        );
        console.log("35 authcontroller save user photo error");
        console.log(error);
        console.log(
          "==========================================================="
        );
        console.log("\n");
      }
      return res.send(user);
    } else {
      let x = user.photo.split("/");
      let path = "backend/public/images/" + x[4];

      try {
        await unlinkAsync(path);
      } catch (error) {
        console.log("\n");
        console.log(
          "==========================================================="
        );
        console.log("66 authcontroller save user photo error");
        console.log(error);
        console.log(
          "==========================================================="
        );
        console.log("\n");
      }
      user.photo = imageUrl;
      try {
        await user.save();
      } catch (error) {
        console.log("\n");
        console.log(
          "==========================================================="
        );
        console.log("35 authcontroller save user photo error");
        console.log(error);
        console.log(
          "==========================================================="
        );
        console.log("\n");
        return res.status(500).json({
          result: false,
          details: error,
        });
      }

      return res.send(user);
    }
  },
  saveProfilePic: async (req, res) => {
    console.log("update profile photo");
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization;
      try {
        decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
      } catch (e) {
        return res.status(401).send("unauthorized");
      }
      var email = decoded.email;
      try {
        const user = await User.findOneAndUpdate(
          { email: email },
          { photo: req.body.photo }
        );
        console.log(req.body);
        return res.status(200).json({
          msg: "user profile photo updated",
          details: user,
          result: true,
        });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          result: false,
          details: e,
        });
      }
    }
  },

  saveSocialLogin: async (req, res) => {
    console.log("ssaving google login user data");
    let foundUser;
    try {
      foundUser = await User.findOne({ email: req.body.email });
    } catch (error) {
      console.log("error in user finding 110 ");
      console.log(error);
      return res.status(500).json({
        result: false,
        details: error,
      });
    }
    //IF THE USER DOESN'T EXIST, CREATE NEW USER
    if (!foundUser) {
      let hash;
      try {
        hash = await bcrypt.hash(req.body.password, 10);
      } catch (error) {
        console.log("error in bcrypting 116 ");
        console.log(error);
        return res.status(500).json({
          result: false,
          details: error,
        });
      }

      const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: hash,
        photo: req.body.image,
        confirmed: true,
      });

      try {
        await user.save();
      } catch (error) {
        console.log("error in ");
        console.log(error);
        return res.status(500).json({
          result: false,
          details: error,
        });
      }
      const payload = {
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.EMAIL_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        msg: "Welcome to planendar",
        token: token,
        user: user,
        result: true,
      });
    } else if (foundUser) {
      const payload = {
        email: foundUser.email,
      };
      const token = jwt.sign(payload, process.env.EMAIL_SECRET, {
        expiresIn: "1h",
      });
      if (!foundUser.photo) {
        foundUser.photo = req.body.image;
      }
      try {
        await foundUser.save();
      } catch (error) {
        console.log("error saving social login photo");
        console.log(error);
      }
      foundUser = {
        email: foundUser.email,
        name: foundUser.name,
        _id: foundUser._id,
        photo: foundUser.photo,
      };

      return res.status(200).json({
        msg: "Welcome Back..!!",
        token: token,
        user: foundUser,
        result: true,
      });
      // return bcrypt.compare(req.body.password, foundUser.password)
    }
  },
  signUp: async (req, res) => {
    console.log("why here");

    let hash;
    try {
      hash = await bcrypt.hash(req.body.password, 10);
    } catch (error) {
      console.log("authcont 99: error bcrypting");
      return res.status(500).json({
        result: false,
        details: error,
      });
    }

    var user = new User({
      email: req.body.email,
      name: req.body.name,
      password: hash,
    });

    var emailSent = false;
    try {
      user = await user.save();
    } catch (error) {
      console.log("authcont 113: error saving user");
      console.log(error);
      return res.status(500).json({
        result: false,
        details: "Email already Exist.",
      });
    }

    try {
      emailToken = jwt.sign(
        { user: _.pick(user, "id") },
        process.env.EMAIL_SECRET,
        { expiresIn: "1d" }
      );

      var emailToken;

      const url =
        process.env.BACK_URL +
        ":" +
        process.env.port +
        `/auth/confirmation/${emailToken}`;
      // const url = `http://ec2-18-132-13-64.eu-west-2.compute.amazonaws.com:5000/auth/confirmation/${emailToken}`;
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
          from: "hussain.akhss2010@gmail.com",
          // to: 'hussain.akhss2010@gmail.com ',
          to: req.body.email,
          subject: "PLANENDAR | Confirm Email",
          // text: 'hello world!'
          html: `
                    <h3>Please click the link below to confirm your email</h3>
                       <hr>
                       <a href="${url}">${url}</a>
                     `,
        },
        (error, info) => {
          if (error) {
            return res.status(500).json({
              result: false,
              details: error,
            });
          } else {
            return res.status(201).json({
              result: true,
              details: user,
              emailSent: true,
            });
          }
        }
      );
    } catch (error) {
      console.log("authcont 120: error saving jwt sign");
      console.log(error);
      return res.status(500).json({
        result: false,
        details: error,
      });
    }
  },
};
