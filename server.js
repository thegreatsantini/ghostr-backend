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
var twitterTokenStrategy = require('passport-twitter-token');
var request = require('request');


// var consumer = new oauth.OAuth(
//   "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
//   process.env.TWITTER_KEY, process.env.TWITTER_SECRET, "1.0A", "http://127.0.0.1:8080/sessions/callback", "HMAC-SHA1");

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(logger({ path: "log/express.log" }));
// app.use(cookieParser());
// app.use(session({
//   secret: "I'm a secret string",
//   resave: true,
//   saveUninitialized: true
// }));
app.use(morgan('dev'));
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.set('view engine', 'ejs');

///////////////////////////////////////
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/tweets', tweetRouter);


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


module.exports = function () {

  passport.use(new TwitterTokenStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      includeEmail: false	//changed from true
    },
    function (token, tokenSecret, profile, done) {
      db.User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
    }));

};

var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
  return res.status(200).send(JSON.stringify(req.user));
};

//token handling middleware
var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});
// http://127.0.0.1/sessions/callback
app.post('/auth/twitter/reverse', function(req, res){
	request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: process.env.TWITTER_KEY,
        consumer_secret: process.env.TWITTER_SECRET
      }
    }, function (err, r, body) {
      if (err) {
      	console.log('error with reverse\n', err)
        return res.send(500, { message: err.message });
      }

      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
});

app.post('/auth/twitter', function(req, res, next) {
	console.log('/auth/twitter')
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: process.env.TWITTER_KEY,
        consumer_secret: process.env.TWITTER_SECRET,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
      	console.log('error with auth/twitter\n', err)
        return res.send(500, { message: err.message });
      }

      console.log(body);
      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      //db.User.

      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      return next();
}, generateToken, sendToken);

/*
app.get('/sessions/connect', cors(), function (req, res) {
  console.log('connect function');
  consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
    if (error) {
      res.status(500).send("Error getting OAuth request token : " + inspect(error));
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      // console.log("Double check on 2nd step");
      // console.log("------------------------");
      // console.log("<<" + req.session.oauthRequestToken);
      // console.log("<<" + req.session.oauthRequestTokenSecret);
      res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
    }
  });
});


app.get('/sessions/callback', cors(), function (req, res) {
  // console.log("------------------------");
  // console.log(">>" + req.session.oauthRequestToken);
  // console.log(">>" + req.session.oauthRequestTokenSecret);
  // console.log(">>" + req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.query.oauth_token, '', req.query.oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.status(500).send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(results) + "]");
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

      // res.redirect('http://localhost:3000');
      res.redirect('/');
    }
  });
});

// app.get('/', cors(), function (req, res) {
//   console.log('trying to remain logged in?');
//   consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
//     if (error) {
//       console.log('failed', error)
//       res.redirect('/sessions/connect');
//     } else {
//       var parsedData = JSON.parse(data);
//       console.log('success twitter remaining logged in', parsedData);
//       //res.send('You are signed in: ' + inspect(parsedData.screen_name));
//       res.send(data);
//     }
//   });
// });

app.get('/', cors(), function (req, res) {
  console.log('trying to remain logged in for FE?');
  consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
    if (error) {
      console.log('failed', error);
      consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          res.status(500).send("Error getting OAuth request token : " + inspect(error));
        } else {
          req.session.oauthRequestToken = oauthToken;
          req.session.oauthRequestTokenSecret = oauthTokenSecret;
          // console.log("Double check on 2nd step");
          // console.log("------------------------");
          // console.log("<<" + req.session.oauthRequestToken);
          // console.log("<<" + req.session.oauthRequestTokenSecret);
          res.send({ redirect: "https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken });
        }
      });
    } else {
      var parsedData = JSON.parse(data);
      console.log('success twitter remaining logged in', parsedData);
      //res.send('You are signed in: ' + inspect(parsedData.screen_name));
      res.send({ user: parsedData });
    }
  });
});

*/

// app.get('/', cors(), function (req, res) {
//   console.log('trying to remain logged in for FE?');
//   if(!req.session.oauthAccessToken){
//   	consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
// 	    if (error) {
// 	      res.status(500).send("Error getting OAuth request token : " + inspect(error));
// 	    } else {
// 	      req.session.oauthRequestToken = oauthToken;
// 	      req.session.oauthRequestTokenSecret = oauthTokenSecret;
// 	      // console.log("Double check on 2nd step");
// 	      // console.log("------------------------");
// 	      // console.log("<<" + req.session.oauthRequestToken);
// 	      // console.log("<<" + req.session.oauthRequestTokenSecret);
// 	      // res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
// 	      console.log('doin the thing');
// 		consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
// 	      if (error) {
// 	        console.log('failed to log in!', error);
// 	        return {user: null, message: "doTheThing: Error getting OAuth request token"}
// 	      } 
// 	      else {
// 	        var parsedData = JSON.parse(data);
// 	        console.log('success twitter remaining logged in', parsedData);
// 	        return { user: parsedData, message: null };
// 	      }
// 	    });
  		  
// 	    }
// 	  });
//   }
//   else{
// 	console.log('doin the thing');
// 	consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
//       if (error) {
//         console.log('failed to log in!', error);
//         return {user: null, message: "doTheThing: Error getting OAuth request token"}
//       } 
//       else {
//         var parsedData = JSON.parse(data);
//         console.log('success twitter remaining logged in', parsedData);
//         return { user: parsedData, message: null };
//       }
//     });
//   }
	    
// });



// app.get('/', cors(), function(req, res) {
// 	res.json('homepage');
// })

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