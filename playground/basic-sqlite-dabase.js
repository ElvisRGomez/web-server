var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync().then(function () {
    console.log('everything is synced');
    
    Todo.findById(2).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('Todo not found');
        }
    }).catch(function (e) {
        console.log(e);
    });
    
    // Todo.create({
    //     description: 'walk my dog',
    //     completed: false
    // }).then(function (todo) {
    //     return Todo.create({
    //         description: 'clean the house'
    //     });
    // }).then(function () {
    //     return Todo.findById(2);
    //     // return Todo.findAll({
    //     //     where: {
    //     //         description: {
    //     //             $like: '%walk%'
    //     //         }
    //     //     }
    //     // });
    // }).then(function (todo) {
    //     if (todo) {
    //             console.log(todo.toJSON());
    //         // todo.forEach(function (todo) {
    //         //     console.log(todo.toJSON());
    //         // });
    //     } else {
    //         console.log('No todo Found!');
    //     }
    // }).catch(function (e) {
    //     console.log(e);
    // });
});