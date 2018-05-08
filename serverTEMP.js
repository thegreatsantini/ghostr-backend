require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('express-logger');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var inspect = require('util-inspect');
var oauth = require('oauth');
// var MemoryStore = require('memorystore')(session); //might cause issues after deploying

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

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});


app.get('/sessions/connect', function(req, res){
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.status(500).send("Error getting OAuth request token : " + inspect(error));
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      console.log("Double check on 2nd step");
      console.log("------------------------");
      console.log("<<"+req.session.oauthRequestToken);
      console.log("<<"+req.session.oauthRequestTokenSecret);
      //console.log("##############\n",req.session)
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
});


app.get('/sessions/callback', function(req, res){
  console.log("##############\n",req.session)
  console.log("------------------------");
  console.log(">>"+req.session.oauthRequestToken);
  console.log(">>"+req.session.oauthRequestTokenSecret);
  console.log(">>BODY", req.body);
  console.log(">>QUERY", req.query);
  console.log(">>"+req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.query.oauth_token, '', req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.status(500).send("Error getting OAuth access token : " + inspect(error) + "[" + oauthAccessToken + "]" + "[" + oauthAccessTokenSecret + "]" + "[" + inspect(results) + "]");
    } else {
      console.log('no error!');
      console.log(oauthAccessToken, oauthAccessTokenSecret);
      console.log('session is now', req.session);
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      console.log('session is now', req.session);
      
      res.redirect('/home');
    }
  });
});

app.get('/home', function(req, res){
    // consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
    consumer.get("https://api.twitter.com/1.1/account/verify_credentials.json", process.env.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET, function (error, data, response) {
      if (error) {
        //console.log(error)
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