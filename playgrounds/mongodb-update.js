const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if(err) {
		//se non usassi il return il programma andrebbe avanti con l'esecuzione
		return console.log('Non riesco a connetrmi a MongoDB');
	}
	console.log('Connessione a MongoDB riuscita!');
	const db = client.db('TodoApp');

	//Trova l'elemento e aggironale
	/*db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID("5b34dc2fb8167393e5e68ec1")
	}, {
		$set: { //Questo è un operatore di mongodb realtivo ad update https://docs.mongodb.com/manual/reference/operator/update/
			completed: true
		}
	}, {
		returnOriginal:false
	}).then((results) => {
		console.log(results);
	});*/


	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID("5b34ce54b8167393e5e68b1b")
	}, {
		$set: { //Questo è un operatore di mongodb realtivo ad update https://docs.mongodb.com/manual/reference/operator/update/
			name: 'Marco'
		},
		$inc: {	//Questo è un operatore di mongodb realtivo ad update https://docs.mongodb.com/manual/reference/operator/update/
			age: 10
		}
	}, {
		returnOriginal:false
	}).then((results) => {
		console.log(results);
	});


	//client.close();//Chiudo la connessione
});