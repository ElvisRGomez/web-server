var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// The collect function combines two objects together.
// function collect() {
//   var ret = {};
//   var len = arguments.length;
//   var p;
//   for (var i=0; i<len; i++) {
//     for (p in arguments[i]) {
//       if (arguments[i].hasOwnProperty(p)) {
//         ret[p] = arguments[i][p];
//       }
//     }
//   }
//   return ret;
// }

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

//Todos Post /post
app.post('/todos', function (req, res) {
	var body = req.body;
	// var id = {"id": + todoNextId};
	// var toPush = collect(id, body);
	body.id = todoNextId++; // inserts a new field into the object 'id'.

	todos.push(body);
	// todoNextId++;

	res.json(body);
});

app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
});