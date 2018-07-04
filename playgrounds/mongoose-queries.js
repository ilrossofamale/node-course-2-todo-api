const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo.js');
const {Users} = require('./../server/models/users.js');



var id = '5b3a4562fb9abb202c33ab0a11';

/*
if(!ObjectId.isValid(id)) {
	console.log('ID non valido');
}
*/


/*Todo.find({
	_id: id
}).then((todos) => {
	console.log('Todos', todos);
});


Todo.findOne({
	_id: id
}).then((todo) => {
	console.log('Todo', todo);
});


Todo.findById(id).then((todo) => {
	if(!todo) {
		return console.log('Non esiste');
	}
	console.log('Todo by Id', todo);
}).catch((e) => console.log(e));*/

id = '5b34f76edcdba52eccae2756';


Users.findById(id).then((user) => {
	if(!user) {
		return console.log('non ci sono utenti');
	}
	console.log(JSON.stringify(user, undefined, 2));

}, (e) => {
	console.log(e)
})