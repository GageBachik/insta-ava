var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://insta-ava:freedom347@ds049150.mongolab.com:49150/insta-ava');
Instagram = require('instagram-node-lib');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

var IMAGE_TAG = 'blue'
Instagram.set('client_id', '3c91d050cfd749178805d7660b1499ca');
Instagram.set('client_secret', 'adaa5118a8df4e169c37734156302799');

var getAllowedImages = function(tag, view){
	Instagram.tags.recent({
		name: tag,
		complete: function(data){
			var json = [];
			data.map(function(imagObj, index){
				var jsonObj = {id: imagObj.id, image: imagObj.images.low_resolution.url};
				json.push(jsonObj);
			});
			if (view) {
				res.render(view, json);
			}else{
				res.send(json);
			}
		}
	});
}

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/admin', function(req, res) {
	var pass = req.query.password;
	if (pass === 'password') {
		getAllowedImages(IMAGE_TAG, 'admin');
	}else{
		res.send('INCORRECT PASSWORD!')
	}
});

app.get('/feed', function(req, res) {
	getAllowedImages(IMAGE_TAG)
});

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
