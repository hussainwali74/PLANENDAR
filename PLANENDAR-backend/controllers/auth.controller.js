var passport = require('passport');
var mongoose = require('mongoose');
const User = require('../models/auth.model')
const expressJWT = require('express-jwt')
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
// custom error handler
const { errorHandler } = require('../helpers/dbErrorHandling')
//send email
const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

sgMail.setApiKey(process.env.MAIL_KEY)

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    const { name, email, password } = req.body
    console.log(name, email, password)

    const errors = validationResult(req)


    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({ email }).exec((err, user) => {
            //if user already exists
            if (user) {
                return res.status(400).json({
                    errors: 'Email is taken'
                });
            }
        })
    }

    const token = jwt.sign(
        {
            name,
            email,
            password
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
            expiresIn: '5m'
        }
    );

    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account activation link',
        html: `
                  <h1>Please use the following to activate your account</h1>
                  <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                  <hr />
                  <p>This email may containe sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
              `
    };

    sgMail
        .send(emailData)
        .then(sent => {
            return res.json({
                message: `Email has been sent to ${email}`
            });
        })
        .catch(err => {
            return res.status(400).json({
                success: false,
                errors: errorHandler(err)
            });
        });


};

module.exports.login = function (req, res) {


    passport.authenticate('local', function (err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};