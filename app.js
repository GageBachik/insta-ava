var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://insta-ava:freedom347@ds049150.mongolab.com:49150/insta-ava');
var Blocked = mongoose.model('Blocked', { image: String });
Instagram = require('instagram-node-lib');
var port = process.env.PORT || 3000;
var cors = require('cors')
Instagram.set('client_id', '3c91d050cfd749178805d7660b1499ca');
Instagram.set('client_secret', 'adaa5118a8df4e169c37734156302799');
var IMAGE_TAG = 'plane'

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

var getAllowedImages = function(tag, view, res){
	Instagram.tags.recent({
		name: tag,
		complete: function(data){
			var json = [];
			var blockedIds = [];
			Blocked.find(function (err, blocks) {
			  if (err) return console.error(err);
			  blocks.map(function(block,index){
			  	blockedIds.push(block.image);
			  });
			  data.map(function(imagObj, index){
			  	if (blockedIds.indexOf(imagObj.id) === -1) {
			  		var jsonObj = {id: imagObj.id, image: imagObj.images.low_resolution.url};
			  		json.push(jsonObj);
			  	};
			  });
			  if (view) {
			  	res.render(view, {images: json});
			  }else{
			  	res.send(json);
			  }
			});
		}
	});
}

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/block', function(req, res) {
	var block = new Blocked({ image: req.body.image });
	block.save(function (err) {
	  if (err)
	  	res.send('error');
		res.send('success');
	});
});

app.get('/admin', function(req, res) {
	var pass = req.query.password;
	if (pass === 'password') {
		getAllowedImages(IMAGE_TAG, 'admin', res);
	}else{
		res.send('INCORRECT PASSWORD!')
	}
});

app.get('/feed', function(req, res) {
	getAllowedImages(IMAGE_TAG, null, res)
});

var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
