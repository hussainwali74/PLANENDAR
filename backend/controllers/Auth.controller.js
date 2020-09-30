const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')

module.exports = {
    saveProfilePic: async (req, res) => {
        console.log('update profile photo')
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization;
            try {
                decoded = jwt.verify(authorization, process.env.EMAIL_SECRET);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var email = decoded.email;
            try {

                const user = await User.findOneAndUpdate({ email: email }, { photo: req.body.photo })
                console.log(req.body)
                return res.status(200).json({
                    msg: "user profile photo updated",
                    details: user,
                    result: true
                })
            } catch (e) {
                console.log(e)
            }
        }

    },

    saveSocialLogin: async (req, res) => {
        console.log("save social creds")
        console.log('ssaving google login user data');
        let fetchedUser;
        let foundUser;
        try {
            foundUser = await User.findOne({ email: req.body.email });
        } catch (error) {
            console.log('error in user finding 110 ')
            console.log(error)
        }
        //IF THE USER DOESN'T EXIST, CREATE NEW USER
        if (!foundUser) {
            let hash;
            try {
                hash = await bcrypt.hash(req.body.password, 10);
            } catch (error) {
                console.log('error in bcrypting 116 ')
                console.log(error)
            }
            const user = new User({
                email: req.body.email,
                name: req.body.name,
                password: hash,
                photo: req.body.image,
                confirmed: true
            });

            try {
                await user.save();
            } catch (error) {
                console.log('error in ')
                console.log(error)
            }
            const payload = {
                email: user.email
            };
            const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "1h" })

            return res.status(200).json({
                msg: "Welcome to planendar",
                token: token,
                result: true
            });
        } else if (foundUser) {
            const payload = {
                email: foundUser.email
            };
            const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "1h" })
            foundUser = { email: foundUser.email, name: foundUser.name }
            res.status(200).json({
                msg: "Welcome Back..!!",
                token: token,
                user: foundUser,
                result: true
            });
            // return bcrypt.compare(req.body.password, foundUser.password)
        }

    },
}
