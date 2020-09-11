const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');


const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const personController = require('./controllers/person.controller')

//load config
dotenv.config({ path: './config/config.env' })


// require('./models/db');
// require('./config/passportnew');


//passport config
require('./config/passport')(passport)

const app = express()
connectDB()



app.use(passport.initialize());
// app.use('/api', routesApi);

// CORS

//enables cors
// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
//     'exposedHeaders': ['sessionId'],
//     'origin': '*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     'preflightContinue': false
// }));
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", `Origin, X-Requested-With, Accept, Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, Accept-Encoding`);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     next();
// });

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// app.use(cors({ origin: 'http://localhost:4200' }))
// app.use(express.urlencoded({ extended: false }))
// app.use(express.json())
//Logging

// Body Parser
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}


//Routes
const authRouter = require('./routes/auth.route')

//use routes
app.use('/api/', authRouter)



app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Page Not Found"
    })
});

//session 
// // app.use(session({
// //     secret: 'planendar',
// //     resave: false,
// //     saveUninitialized: false,
// //     // store: new MongoStore({ mongooseConnection: mongoose.connection })
// //     // cookie: { secure: true }
// // }))

// //passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

//Static Folder
// app.use(express.static(path.join(__dirname, '/public')))


//Routes
// app.use('/person', personController);
// app.use('/', require('./routes/index'));
// app.use('/auth', require('./routes/auth'));
// app.use('/stories', require('./routes/stories.routes'));

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`))