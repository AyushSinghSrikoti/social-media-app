const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port = 8080;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const path =require('path');
const dbUrl = 'mongodb://127.0.0.1:27017/bruhgram_development';
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000, function (error) {
    if (error) {
        console.log("Error in setting up Chat Server");
    } else {
        console.log("Chat Server is listening on port 5000");
    }
});


// Enable CORS for all routes
app.use(cors());

// Configure CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode,env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'bruhgram',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongoUrl: dbUrl,
            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || 'connect-mongo db setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
