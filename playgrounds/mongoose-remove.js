const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo.js');
const {Users} = require('./../server/models/users.js');



//Cancella tutto e restituisce il numero di ciò che viene cancellato
Todo.remove({}).then( (result) => {
	console.log(result);
});


//Cancella selezionandolo da una qualsiasi proprietà custom e restituisce l'oggetto cancellato
Todo.findOneAndRemove({_id: '5b3cdb5f014edf2491f314ba'}).then( (todo) => {
	console.log(todo);
});

//Cancella selezionandolo per ID e restituisce l'oggetto cancellato
Todo.findByIdAndRemove('5b3cdb5f014edf2491f314ba').then( (todo) => {
	console.log(todo);
})