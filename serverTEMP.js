require('dotenv').config();
var express       = require('express');
var bodyParser    = require('body-parser');
var logger        = require('express-logger');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var inspect       = require('util-inspect');
var oauth         = require('oauth');
var morgan        = require('morgan');
var createError   = require('http-errors');
var indexRouter   = require('./routes/index');
var usersRouter   = require('./routes/users');
var authRouter    = require('./routes/auth');
var tweetRouter   = require('./routes/tweets');
var path          = require('path');
var app = express();

var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
    process.env.TWITTER_KEY, process.env.TWITTER_SECRET, "1.0A", "http://127.0.0.1:8080/sessions/callback", "HMAC-SHA1");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger({ path: "log/express.log"}));
app.use(cookieParser());
app.use(session({ 
	secret: "I'm a secret string", 
	resave: true, 
	saveUninitialized: true
}));
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});


///////////////////////////////////////
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/tweets', tweetRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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


app.get('/sessions/connect', function(req, res){
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.status(500).send("Error getting OAuth request token : " + inspect(error));
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      // console.log("Double check on 2nd step");
      // console.log("------------------------");
      // console.log("<<"+req.session.oauthRequestToken);
      // console.log("<<"+req.session.oauthRequestTokenSecret);
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
});


app.get('/sessions/callback', function(req, res){
  // console.log("------------------------");
  // console.log(">>"+req.session.oauthRequestToken);
  // console.log(">>"+req.session.oauthRequestTokenSecret);
  // console.log(">>"+req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.query.oauth_token, '', req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.status(500).send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(results) + "]");
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      res.redirect('/home');
    }
  });
});

app.get('/home', function(req, res){
    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET, function (error, data, response) {
      if (error) {
        console.log(error)
        res.redirect('/sessions/connect');
      } else {
        var parsedData = JSON.parse(data);
        res.send('You are signed in: ' + inspect(parsedData.screen_name));
      } 
    });
});

app.get('*', function(req, res){
    res.redirect('/home');
});

app.listen(8080, function() {
  console.log('App runining on port 8080!');
});

////////////////////////////////////////////////////
var http = require('http');
module.exports = app;
var server = http.createServer(app);
server.listen(4007);