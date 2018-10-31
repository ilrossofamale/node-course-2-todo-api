require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;


app.use(bodyParser.json());


app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id //attraverso il meddleware authenticate associo la nota creata all'id del creatore al suo token
	})
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});


app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id //attraverso il meddleware authenticate cerco solo le note create dall'utente al suo token
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
})


app.get('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	if(!ObjectId.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findOne({
			_id: id,
			_creator: req.user._id
		}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		return res.status(400).send();
	});
});


app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	if(!ObjectId.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findOneAndRemove({
			_id: id,
			_creator: req.user._id
		}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		return res.status(400).send();
	});
})


app.patch('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text','completed']);

	if(!ObjectId.isValid(id)) {
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}
	Todo.findOneAndUpdate({_id: id,_creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
		if(!todo){
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e)=>{
		res.status(400).send();
	});
});


app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email','password']);
	var user = new Users(body);
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});


app.get('/users/me', authenticate, (req, res) => { //utilizzo la funzione authenticate come middleware per controllare l'autenticazione con il tokens
	res.send(req.user);
});


app.post('/users/login', (req,res) => {
	var body = _.pick(req.body, ['email','password']);
	Users.findByCredential(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		})
	}).catch((err) => {
		res.status(400).send();
	});
})


app.delete('/users/me/token', authenticate, (req,res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	} , () => {
		res.status(400).send();
	})
})


app.listen(port, () => {
	console.log(`Avviata sulla porta ${port}`);
});


module.exports = {app};