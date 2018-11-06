const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo'); //modello todo
const {Users} = require('./../../models/users'); //modello utent


const userOneId = new ObjectId();
const userTwoId = new ObjectId();

//Array dummy di utenti
const users = [{
	_id: userOneId,
	email:'marco.baccanelli@gmail.com',
	password:'passwordUno',
	tokens : [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString() //process.env.JWT_SECRET questa variabile è nel file di configurazione
	}]
},{
	_id: userTwoId,
	email:'pietro.baccanelli@gmail.com',
	password:'passwordTwo',
	tokens : [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString() //process.env.JWT_SECRET questa variabile è nel file di configurazione
	}]
}]

//Array dummy di todos
const todos = [{
	_id: new ObjectId,
	text: "Primo testo todo test",
	_creator: userOneId
},{
	_id: new ObjectId,
	text: "Secondo testo todo test",
	completed: true,
	completedAt: 333,
	_creator: userTwoId
}];


const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	Users.remove({}).then(() => {
		var userOne = new Users(users[0]).save();
		var userTwo = new Users(users[1]).save();
		return Promise.all([userOne,userTwo]);// dato che "new Users()" è una Promise entrambe le dichiarazioni delle variabili hanno un then che viene risolto per entrambi con il metodo all a cui viene passato un array con le Promise da eseguire
	}).then(() => done());
};


module.exports = {todos,populateTodos,users,populateUsers};