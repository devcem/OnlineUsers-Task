var express  = require('express');
var app      = express();
var path     = require('path');
var sessions = {};

app.use(express.urlencoded());

var generateId = function () {
	return '_' + Math.random().toString(36).substr(2, 9);
};

var getOnlineCount = function(sessionId){
	var totalCount = 0;

	//is session exist?
	if(sessions[sessionId]){
		for(var userIndex in sessions[sessionId].users){
			var user = sessions[sessionId].users[userIndex];

			if(Date.now() - user < 2500){
				totalCount++;
			}
		}
	}

	return totalCount;
};

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

//call example : session?id=sessionId
app.post('/session', function (req, res) {
	var sessionId = req.body.id;
	var userId    = req.body.userId;
	var output    = {};

	if(sessions[sessionId]){
		sessions[sessionId].users[userId] = Date.now();

		output = {
			title  : sessions[sessionId].title,
			online : getOnlineCount(sessionId)
		};
	}

	res.json(output);
});

//call example : session-list
app.post('/session-list', function (req, res) {
	var output = [];

	for(var index in sessions){
		var session = sessions[index];

		output.push({
			id     : session.id,
			title  : session.title,
			online : getOnlineCount(session.id)
		});
	}

	res.json(output);
});

//call example : create-session
app.post('/create-session', function (req, res) {
	var title     = req.body.title;
	var sessionId = generateId();

	sessions[sessionId] = {
		id : sessionId,
		title : title,
		tasks : [],
		users : []
	};

	res.json({ sessionId : sessionId });
});

app.listen(8080);
console.log('Server started at localhost:8080');