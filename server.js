require('dotenv').config();
var express        = require('express');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var morgan         = require('morgan');
var path           = require('path');
var cors           = require('cors');
var expressSession = require('express-session');
var passportConfig = require('./passport');
var db             = require('./models');
var usersRouter    = require('./routes/users');
var authRouter     = require('./routes/auth');
var profileRouter  = require('./routes/profile');
var app            = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
	origin: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
	exposedHeaders: ['x-auth-token']
}));
// app.use(expressSession({ 
// 	secret: process.env.SESSION_SECRET
// 	,resave: true 
// 	,saveUninitialized: true
// }));
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET
	,resave: false 
	,saveUninitialized: false
	,cookie: {maxAge: 1000*60*60*24*7}
}));
app.use(passportConfig.initialize());
app.use(passportConfig.session());


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

app.get('*', function (req, res) {
	console.log('(404) User entered path that doesn\'t exist. Redirecting to homepage.')
	res.redirect(process.env.FRONTEND_URL);
});

app.listen(process.env.PORT || 8080, function() {
	console.log('Listening on port 8080');
});