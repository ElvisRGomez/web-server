var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'save file',
    isComplete: false
}, {
    id: 2,
    description: 'get file',
    isComplete: false
},{
	id: 3,
	description: 'run file',
	isComplete: true
}];

app.get('/', function (req, res) {
    res.send('To Do API root');
});

app.get('/todos', function (req, res) {
    res.json(todos);
});

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedId;

	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedId = todo;
		}
	});

	if (matchedId) {
		res.json(matchedId);
	} else {
		res.status(404).send();
	}
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});