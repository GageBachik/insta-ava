var express = require('express');
var bodyParser = require('body-parser');
Instagram = require('instagram-node-lib');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));


Instagram.set('client_id', '3c91d050cfd749178805d7660b1499ca');
Instagram.set('client_secret', 'adaa5118a8df4e169c37734156302799');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/admin', function(req, res) {
	var pass = req.query;
	if (pass === 'password') {
		res.render('admin');
	}else{
		res.send('INCORRECT PASSWORD!')
	}
});

app.get('/feed', function(req, res) {
	Instagram.tags.recent({
		name: 'blue',
		complete: function(data){
			var json = [];
			data.map(function(imagObj, index){
				var jsonObj = {id: imagObj.id, image: imagObj.images.low_resolution.url};
				json.push(jsonObj);
			});
			res.send(json);
		}
	});
});

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
