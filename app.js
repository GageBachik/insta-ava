var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:lolsauce123!@linus.mongohq.com:10004/insta-ava');
var Blocked = mongoose.model('Blocked', { image: String });
Instagram = require('instagram-node-lib');
var port = process.env.PORT || 3000;
var cors = require('cors')
Instagram.set('client_id', '86954931cb85472abf8c968e961e40c7');
Instagram.set('client_secret', 'e32960326b4b41958d65f676cf0d8785');
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
