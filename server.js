require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('express-logger');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var inspect = require('util-inspect');
var oauth = require('oauth');
var morgan = require('morgan');
var createError = require('http-errors');
var path = require('path');
//var indexRouter   = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var tweetRouter = require('./routes/tweets');
var cors = require('cors');
var app = express();

var consumer = new oauth.OAuth(
  "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
  process.env.TWITTER_KEY, process.env.TWITTER_SECRET, "1.0A", "http://127.0.0.1:8080/sessions/callback", "HMAC-SHA1");

/* Connect to MongoDB */

const url = 'mongodb://localhost:27017/inkyTweet';

mongoose.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger({ path: "log/express.log" }));
app.use(cookieParser());
app.use(session({
  secret: "I'm a secret string",
  resave: true,
  saveUninitialized: true
}));
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
//////////////////////////////////////////


app.get('/sessions/connect', cors(), function (req, res) {
  consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
    if (error) {
      res.status(500).send("Error getting OAuth request token : " + inspect(error));
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      console.log("Double check on 2nd step");
      console.log("------------------------");
      console.log("<<" + req.session.oauthRequestToken);
      console.log("<<" + req.session.oauthRequestTokenSecret);
      res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
    }
  });
});


app.get('/sessions/callback', cors(), function (req, res) {
  console.log("------------------------");
  console.log(">>" + req.session.oauthRequestToken);
  console.log(">>" + req.session.oauthRequestTokenSecret);
  console.log(">>" + req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.query.oauth_token, '', req.query.oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.status(500).send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(results) + "]");
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      res.redirect('/');
    }
  });
});

app.get('/', cors(), function (req, res) {
  console.log('trying to remain logged in?');
  // consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET, function (error, data, response) {
  consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
    if (error) {
      console.log('failed', error)
      res.redirect('/sessions/connect');
    } else {
      var parsedData = JSON.parse(data);
      console.log('success twitter remaining logged in', parsedData);
      //res.send('You are signed in: ' + inspect(parsedData.screen_name));
      res.json(data);
    }
  });
});

app.get('/fe', cors(), function (req, res) {
  console.log('trying to remain logged in for FE?');
  // consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET, function (error, data, response) {
  consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
    if (error) {
      console.log('failed', error);
      consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
          res.status(500).send("Error getting OAuth request token : " + inspect(error));
        } else {
          req.session.oauthRequestToken = oauthToken;
          req.session.oauthRequestTokenSecret = oauthTokenSecret;
          console.log("Double check on 2nd step");
          console.log("------------------------");
          console.log("<<" + req.session.oauthRequestToken);
          console.log("<<" + req.session.oauthRequestTokenSecret);
          res.send({ redirect: "https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken });
        }
      });
    } else {
      var parsedData = JSON.parse(data);
      console.log('success twitter remaining logged in', parsedData);
      //res.send('You are signed in: ' + inspect(parsedData.screen_name));
      res.json({ user: data });
    }
  });
});

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