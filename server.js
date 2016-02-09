var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

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
	var queryParams = req.query;
	var filteredTodos = todos;
	
	//Search for completed tasks
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed ==='false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	//Search for Description
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	
	res.json(filteredTodos);
});


// Todos GET ID
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send('Not found!');
		}
	}, function (e) {
		res.status(500).send();
	});
});

//Todos Post /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed'); //picks only description and completed from req.body.
	
	db.todo.create (body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// Delete /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedId = _.findWhere(todos, {id: todoId});

	if (matchedId) {
		todos = _.without(todos, matchedId);
	} else {
		res.status(404).send('Id not found');
	}

	res.json(matchedId);
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedId = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedId) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedId, validAttributes);

	res.json(validAttributes);
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
	    console.log('Express listening on port ' + PORT + '!');
	});
});

