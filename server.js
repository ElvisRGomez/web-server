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
	var query = req.query;
	var where = {};
	
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}
	
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}
	
	db.todo.findAll({where: where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send('server error');
	});
});


// Todos GET ID
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) { //the double exclamation turns todo into a true boolean.
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
	
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			todo.destroy().then(function (todo) {
				res.status(204).send();
			}, function (e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send('Id not found!');
		}
	}, function (e) {
		res.status(500).json(e);
	});
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	} 

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}
	
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			todo.update(attributes).then(function (todo) {
				res.json(todo.toJSON());
			}, function (e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
});

app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	
	db.user.create(body).then(function (user) {
		res.json(user.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

db.sequelize.sync({force: true}).then(function () {
	app.listen(PORT, function () {
	    console.log('Express listening on port ' + PORT + '!');
	});
});

