const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const FriendRequest = require('../models/request.model')
const Notification = require('../models/notification.model')

module.exports = {
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
                user: fetchedUser,
                result: true
            });
        } else if (foundUser) {
            const payload = {
                email: foundUser.email
            };
            const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "1h" })
            foundUser = { email: foundUser.email, name: fetchedUser.name }
            res.status(200).json({
                msg: "Welcome Back..!!",
                token: token,
                user: fetchedUser,
                result: true
            });
            // return bcrypt.compare(req.body.password, foundUser.password)
        }

        // try {

        // } catch (error) {
        //     console.log('error in ')
        //     console.log(error)
        // }

        // User.findOne({ email: req.body.email }).then(result => {
        //     console.log(req.body)
        //     if (!result) {
        //         console.log('hash');

        //         bcrypt.hash(req.body.password, 10).then(hash => {
        //             console.log('gasged')
        //             const user = new User({
        //                 email: req.body.email,
        //                 name: req.body.name,
        //                 password: hash,
        //                 photo: req.body.image,
        //                 confirmed: true
        //             });
        //             console.log('user.save');
        //             user.save().then(result => {
        //                 console.log('res.statsus');
        //                 return res.status(201).json({
        //                     result: true,
        //                     details: result,
        //                 });
        //             });
        //         });
        //     }
        //     if (result) {

        //         fetchedUser = result;
        //         console.log("result")
        //         console.log(result)
        //         return bcrypt.compare(req.body.password, result.password);
        //     } else {
        //         console.log('==================================================================================')
        //         console.log(result)
        //         console.log('==================================================================================')

        //     }
        // }).then(result => {

        //     //Creation of Token Since Credentials are matched
        //     if (fetchedUser) {
        //         const payload = {
        //             email: fetchedUser.email
        //         };
        //         //Secret key to issue JWT token
        //         const token = jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "1h" });
        //         //Sending Token
        //         fetchedUser = { email: fetchedUser.email, name: fetchedUser.name }
        //         res.status(200).json({
        //             msg: "Welcome Back..!!",
        //             token: token,
        //             user: fetchedUser,
        //             result: "true"
        //         });
        //     }

        // }).catch(err => {
        //     console.log(err);
        //     res.status(401).json({
        //         msg: "Authorization Failed..!!",
        //         result: "false"
        //     });
        // });
    },
}
