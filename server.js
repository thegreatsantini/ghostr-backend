require('dotenv').config();
var express      = require('express');
var bodyParser   = require('body-parser');
// var logger       = require('express-logger');
// var cookieParser = require('cookie-parser');
// var session      = require('express-session');
// var inspect      = require('util-inspect');
// var oauth        = require('oauth');
var morgan       = require('morgan');
var createError  = require('http-errors');
var path         = require('path');
//var indexRouter  = require('./routes/index');
var usersRouter  = require('./routes/users');
var authRouter   = require('./routes/auth');
var tweetRouter  = require('./routes/tweets');
var cors         = require('cors');
var app = express();

const db = require('./models');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var expressJwt = require('express-jwt');
// var twitterTokenStrategy = require('passport-twitter-token');
var request = require('request');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
// app.use(bodyParser.json());
// app.use(logger({ path: "log/express.log" }));
// app.use(cookieParser());
// app.use(session({
//   secret: "I'm a secret string",
//   resave: true,
//   saveUninitialized: true
// }));
app.use(morgan('dev'));
// app.use(function (req, res, next) {
//   res.locals.session = req.session;
//   next();
// });
app.set('view engine', 'ejs');

///////////////////////////////////////
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(function(req, res, next) {
 // before every route, attach the flash messages and current user to res.locals
 res.locals.currentUser = req.user;
 next();
});

var passportConfig = require('./passport');
passportConfig();


// var createToken = function(auth) {
//   return jwt.sign({
//     id: auth.id
//   }, 'my-secret',
//   {
//     expiresIn: 60 * 120
//   });
// };

// var generateToken = function (req, res, next) {
//   req.token = createToken(req.auth);
//   return next();
// };

// var sendToken = function (req, res) {
//   res.setHeader('x-auth-token', req.token);
//   return res.status(200).send(JSON.stringify(req.user));
// };

// //token handling middleware
// var authenticate = expressJwt({
//   secret: 'my-secret',
//   requestProperty: 'auth',
//   getToken: function(req) {
//     if (req.headers['x-auth-token']) {
//       return req.headers['x-auth-token'];
//     }
//     return null;
//   }
// });


app.use(require('express-session')({ 
	secret: 'keyboard cat', 
	resave: true, 
	saveUninitialized: true,
	cookie: {
		secure: 'auto'
	},
	maxAge: 360*5
}));

// var session = require('passport');
// app.use(session({ 
// 	secret: 'keyboard cat', 
// 	resave: true, 
// 	saveUninitialized: true,
// 	cookie: {
// 		secure: 'auto'
// 	},
// 	maxAge: 360*5
// }));

app.use(passport.initialize());
app.use(passport.session());
//app.use(express.cookieSession({ secret: 'tobo!', maxAge: 360*5 }));





//app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/auth', authRouter);
app.use('/tweets', tweetRouter);

// This route checks for the existence of a user in the session
app.get('/auth/user', (req, res, next) => {
	let userName = '';
	if (Object.keys(req.sessionStore.sessions).length === 0 && req.sessionStore.sessions.constructor === Object) {
		let key = Object.keys(req.sessionStore.sessions)[0];
		userName = req.sessionStore.sessions[key].replace(/(.+displayName":")(.+)(",".+)/, '$2');
		console.log('something');
	}
	console.log("******************************\n", req.sessionStore.sessions)
	// console.log('#########################\n', name);
	if (userName != '') {
		return res.json({ user: userName })
	} else {
    // TODO: Add db lookup logic here if we can't find user in the session
		return res.json({ user: null })
	}
});

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/auth/login',
  passport.authenticate('twitter'));

app.get('/auth/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
  	// console.log("########################\n",req);
    res.redirect('http://localhost:3000/');
});


// // http://127.0.0.1/sessions/callback
// app.post('/auth/twitter/reverse', function(req, res){
// 	request.post({
//       url: 'https://api.twitter.com/oauth/request_token',
//       oauth: {
//         oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
//         consumer_key: process.env.TWITTER_KEY,
//         consumer_secret: process.env.TWITTER_SECRET
//       }
//     }, function (err, r, body) {
//       if (err) {
//       	console.log('error with reverse\n', err)
//         return res.send(500, { message: err.message });
//       }

//       var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
//       //console.log('jsonStr:', jsonStr);
//       res.send(JSON.parse(jsonStr));
//     });
// });

// app.route('/auth/twitter')
//   .post((req, res, next) => {
//     request.post({
//       url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
//       oauth: {
//         consumer_key: process.env.TWITTER_KEY,
//         consumer_secret: process.env.TWITTER_SECRET,
//         token: req.query.oauth_token
//       },
//       form: { oauth_verifier: req.query.oauth_verifier }
//     }, function (err, r, body) {
//       if (err) {
//         return res.send(500, { message: err.message });
//       }

//       console.log(body);
//       const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
//       const parsedBody = JSON.parse(bodyString);

//       req.body['oauth_token'] = parsedBody.oauth_token;
//       req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
//       req.body['user_id'] = parsedBody.user_id;

//       next();
//     });
//   }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
//       if (!req.user) {
//         return res.send(401, 'User Not Authenticated');
//       }

//       // prepare token for API
//       req.auth = {
//         id: req.user.id
//       };

//       return next();
// }, generateToken, sendToken);


app.get('/api/v1/data', function(req, res) {
	db.User.find({}, function(err, users) {
		if (err) { console.log('############## error finding users:\n', err) }
		let usersIds = [];
		users.forEach(user => usersIds.push(user.twitterId));
		usersIds.sort();
		db.Tweet.find({}, function(error, tweets) {
			if (error) { console.log('############## error finding tweets:\n', error) }
			let tweetCategories = [];
			tweets.forEach(tweet => tweetCategories = tweetCategories.concat(tweet.categories));
			tweetCategories = tweetCategories.filter((word, i) => i === tweetCategories.indexOf(word));
			tweetCategories.sort();
			res.send({usersIDs: usersIds, categories: tweetCategories});
		});
	});
})


// app.get('*', function(req, res){
//     res.redirect('/');
// });

// app.listen(8080, function() {
//   console.log('App runining on port 8080!');
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
////////////////////////////////////////////////////
var http = require('http');
//module.exports = app;
var server = http.createServer(app);
server.listen(8080);