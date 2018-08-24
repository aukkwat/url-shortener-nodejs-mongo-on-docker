var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var shortid = require('shortid');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');


var connectString = 'mongodb://' + config.db.user+":"+config.db.pass + "@" + config.db.host + '/' + config.db.name;

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  short_url_id: String
});
var Url = mongoose.model('Url', urlSchema);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, response){
  
  var longUrl = req.body.url;

  MongoClient.connect(connectString, function(err, db) {
    if (err){
      response.send(err);
      return;
    }
    
    var dbo = db.db(config.db.name);
    var collection = dbo.collection("shorturl");

    collection.find({url:longUrl}).toArray(function (err, items) {
          if(items.length == 0){
            var shortId = shortid.generate();
            var urlData = { url:longUrl , short_id:shortId };
            collection.insertOne(urlData, function(err, res) {
              if (err) throw err;
              var url = config.webhost+shortId;
              response.send({shortUrl:url});
              db.close();
            });
          }else{
            var url = config.webhost+items[0].short_id;
            response.send({shortUrl:url});
            db.close();
          }
      }
    );
  });

});

app.get('/api/shorten', function(req, response){

    var longUrl = req.query.url;

    MongoClient.connect(connectString, function(err, db) {
        if (err){
            response.send(err);
            return;
        }

        var dbo = db.db(config.db.name);
        var collection = dbo.collection("shorturl");

        collection.find({url:longUrl}).toArray(function (err, items) {
                if(items.length == 0){
                    var shortId = shortid.generate();
                    var urlData = { url:longUrl , short_id:shortId };
                    collection.insertOne(urlData, function(err, res) {
                        if (err) throw err;
                        var url = config.webhost+shortId;
                        // response.send({shortUrl:url});
                        response.send(url);
                        db.close();
                    });
                }else{
                    var url = config.webhost+items[0].short_id;
                    // response.send({shortUrl:url});
                    response.send(url);
                    db.close();
                }
            }
        );
    });

});

app.get('/:url_id', function(req, res){
  var url_id = req.params.url_id;
  
  MongoClient.connect(connectString, function(err, db) {
    if (err){
      response.send(err);
      return;
    }
    
    var dbo = db.db(config.db.name);
    var collection = dbo.collection("shorturl");

    collection.find({short_id:url_id}).toArray(function (err, items) {
          if(items.length == 0){
            res.send("404 URL :"+url_id+" not found.");
          }else{
             res.redirect(items[0].url);
          }
          db.close();
      });

  });

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
