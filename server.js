var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('To Do API root');
});


// Todos GET /todos
app.get('/todos', function (req, res) {
    res.json(todos);
});


// Todos GET ID
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedId = _.findWhere(todos, {id: todoId});

	if (matchedId) {
		res.json(matchedId);
	} else {
		res.status(404).send();
	}
});

//Todos Post /post
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed'); //picks only description and completed from req.body.

	//if description and completed are not available and the description is null return bad request
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	//trim spaces in the description
	body.description = body.description.trim();

	body.id = todoNextId++; // inserts a new field into the object 'id'.

	todos.push(body);

	res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});