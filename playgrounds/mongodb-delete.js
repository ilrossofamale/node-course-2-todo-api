const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if(err) {
		//se non usassi il return il programma andrebbe avanti con l'esecuzione
		return console.log('Non riesco a connetrmi a MongoDB');
	}
	console.log('Connessione a MongoDB riuscita!');
	const db = client.db('TodoApp');

	//Cancellare TUTTI i documenti
	/*db.collection('Users').deleteMany({name:'Marco'}).then((results) => {
		console.log(results);
	});*/

	//Cancellare UN documento
	/*db.collection('Users').deleteOne({_id:new ObjectID("5b34aef32a9085285449b2d9")}).then((results) => {
		console.log(results);
	})*/

	//Trova UN documento, CANCELLALO e restituisci ciò che hai cancellato
	/*db.collection('Todos').findOneAndDelete({completed:true}).then((results) => {
		console.log(results)
	})*/

	//client.close();//Chiudo la connessione
});