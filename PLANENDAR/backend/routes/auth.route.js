const express = require('express')
const passport = require('passport')
const router = express.Router()
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var expressjwt = require('express-jwt');

const bcrypt = require('bcryptjs');
const Post = require('../models/post');

const nodemailer = require('nodemailer')
require('dotenv').config()


// require('dotenv').config({ path: __dirname + '../config/config.env' })
const path = require('path')



const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
})


const EMAIL_SECRET = "ASDFAdsds@lkj$skelal9id92jj329ji23229@"



var auth = expressjwt({
    secret: 'MY_SECRET',
    userProperty: 'payload',
    algorithms: ['RS256']
});

//@desc Auth with Google
//@route Get /auth/google

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc google auth callback
// @route GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        console.log('res  got')
        res.send('/dashboard')
    })

// @desc Logout User
// @route /auth/logout
router.get('/logout', (req, res) => {
    req.logout() //since we are using passport it provides this logout method in request
    res.redirect('/')
})



//Login Validation with Credentials and Issue token hhh
router.post('/login', (req, res, next) => {
    console.log(req.body);
    let fetchedUser;
    console.log('===================================================================================')
    console.log('ALL POSTS')
    Post.find().exec().then(docs => {
        console.log(docs)
    })
    console.log('===================================================================================')
    Post.findOne({ email: req.body.email }).then(result => {

        console.log(req.body.password + "||" + result.password);

        if (!result) {
            return res.status(401).json({
                msg: "Authorization Failed..!!",
                result: result
            });
        }
        if (!result.confirmed) {
            return res.status(401).json({
                msg: "Please  confirm your email to login",
                result: "false"
            });
        }
        fetchedUser = result;
        return bcrypt.compare(req.body.password, result.password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({
                msg: "Authorization Failed..!!",
                result: "false"
            });
        }

        //Creation of Token Since Credentials are matched
        const payload = {
            email: fetchedUser.email
        };
        //Secret key to issue JWT token
        const secret = "kadndak#$%^&*dfreqofn2oa2141341";
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        //Sending Token
        res.status(200).json({
            msg: "Authorization Success..!!",
            token: token,
            result: "true"
        });

    }).catch(err => {
        console.log(err);
        res.status(401).json({
            msg: "Authorization Failed..!!",
            result: "false"
        });
    });

});

router.post('/signup', (req, res, next) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new Post({
            email: req.body.email,
            name: req.body.name,
            password: hash
        });
        //remove this line
        var emailSent = false;
        user.save().then(result => {


            //async email sending
            // jwt.sign(
            //   {
            //     user: _.pick(user, 'id')

            //   },
            //   EMAIL_SECRET,
            //   {
            //     expiresIn: '1d',
            //   },
            //   (err, emailToken) => {
            //     const url = `http://localhost:3000/confirmation/${emailToken}`;
            //     transporter.sendMail({
            //       to: args.email,
            //       subject: 'Confirm Email',
            //       html: `
            //       <h3>Please click the link below to confirm your email</h3>
            //       <hr>
            //       <a href="${url}">${url}</a>
            //     `
            //     })
            //   }
            // )

            //sync email sending
            try {

                const emailToken = jwt.sign(
                    {
                        user: _.pick(user, 'id'),
                    },
                    EMAIL_SECRET,
                    {
                        expiresIn: '1d',
                    }
                );
                const url = `http://localhost:3000/auth/confirmation/${emailToken}`
                console.log('================================================================')
                console.log('url')
                console.log(process.env.GMAIL_USER)
                console.log(process.env.GMAIL_PASS)
                console.log('================================================================')
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASS
                    }
                });

                transporter.sendMail({
                    from: 'hussain.akhss2010@gmail.com',
                    // to: 'hussain.akhss2010@gmail.com ',
                    to: req.body.email,
                    subject: 'hello world!',
                    // text: 'hello world!'
                    html: `
                       <h3>Please click the link below to confirm your email</h3>
                       <hr>
                       <a href="${url}">${url}</a>
                     `
                }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    emailSent = true;
                    console.log('Message sent: %s', info.messageId);
                });

            } catch (error) {
                console.log('error while sending mail 44 ')
            }
            res.status(201).json({
                result: true,
                details: result,
                emailSent: emailSent
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                result: false,
                details: "Email already Exist."
            })
        })
    }).catch(err => {
        console.log(err);

    })

}, err => {
    res.status(500).json({
        result: false
    });
});


//USER CLICKS ON CONFIRM EMAIL LINK email confirmed
router.get('/confirmation/:token', async (req, res) => {

    try {
        const { user: { id } } = jwt.verify(req.params.token, EMAIL_SECRET)
        Post.findByIdAndUpdate(id, { confirmed: true }, () => {
            console.log('updated')
        })

    } catch (error) {
        res.send(error)
    }
    return res.redirect('http://localhost:4200/signin');

})


//Login Validation with token for (Angular Route Guard) Note: Input Token as header
router.get('/auth/validation', (req, res, next) => {
    console.log(req.body);
    token = req.headers.authorization;
    const secret = "kadndak#$%^&*dfreqofn2oa2141341";
    try {
        let payload = jwt.verify(token, secret);
        res.status(200).json({
            result: true,
            payload: jwt.verify(token, secret)
        });


    } catch {
        res.status(401).json({
            result: false
        });
    }

}, err => {
    console.log(err);
    res.status(500).json({
        result: false
    });
});


module.exports = router