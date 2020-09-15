//GITHUB PUBLIC REPOSITORY COPY
//Imports
const mongoose = require('mongoose');
const express = require('express');

const cors = require('cors');
const path = require('path');
//Creation of Express App
const app = express();

//Connecting to Mongoose (Place your MongoDB connection string here)
mongoose.connect('mongodb://localhost:27017/planendar', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to Shaw.");
}).catch((error) => {
  console.log("Connection Failed: " + error);
});
const Post = require('./models/post')
Post.remove({}, () => { })

const bodyParser = require('body-parser');
//CORS ERROR PATCH
app.use(cors());
app.use(bodyParser.json());

//GOOGLE LOGIN
app.use('/auth', require('./routes/auth.route'));

//Angular App Hosting Production Build
// app.use(express.static(__dirname + '/dist/login'));

// For all GET requests, send back index.html (PathLocationStrategy) (Refresh Error)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/dist/login/index.html'));
// });

app.use('/*', (req, res, next) => {
  res.status(400).json({
    msg: "Link is Incorrect..!!"
  })
  next();
});
//Exporting Express app for importing in node server script
module.exports = app;