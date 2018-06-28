/* ES6 DESTRUTTURAZIONE VARIABILE */
//var user = {name: 'Pino Scotto', age:65};
//var {name} = user; //dichiarando la variabile in questo modo vado a prelevare il valore di 'name' DESTRUTTURANDO direttamente l'object user precedentemente creato
//console.log(name);
/* ES6 DESTRUTTURAZIONE VARIABILE */

//const MongoClient = require('mongodb').MongoClient;
//usando ES6 DESTRUTTURAZIONE VARIABILE estraggo dall'oggetto mongodb due variabili/metodi (MongoClient e ObjectID) da riutilizzare nel programma
const {MongoClient, ObjectID} = require('mongodb');

//Questo genera un _id secondo le logiche di Mongo
//var obj = new ObjectID();
//console.log(obj);



MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if(err) {
		//se non usassi il return il programma andrebbe avanti con l'esecuzione
		return console.log('Non riesco a connetrmi a MongoDB');
	}
	console.log('Connessione a MongoDB riuscita!');
	const db = client.db('TodoApp');



	//Creo una nuova COLLEZIONE nel db con questo oggetto
	db.collection('Todos').insertOne({
		text: 'Qualche cosa da fare',
		completed: false
	}, (err,results) => {
		if(err) {
			return console.log('Non riesco ad inserire Todos', err);
		}
		console.log(JSON.stringify(results.ops, undefined, 2));

	});

	//Creo una nuova COLLEZIONE nel db con questo oggetto
	db.collection('Users').insertOne({
		//_id: 123,	// Mongo inserisce automaticamente questo id generandone il valore random con una stringa di diversi parmetri
					// (time stamp, identificatore della macchina con cui è stato eseguita l'operazione,...) e poi codificata.
					// Mongo esegue questa operzione per evitare la continua richiesta al db di quale sia l'id più alto da incrementare
					// ed è pensato per i casi in cui molteplici utenti stiano intargendo col db allo stesso momento
					// Comunque, come in qeusto caso, il valore può anche essere specificato senza problemi
		name: 'Marco',
		age: 41,
		location: 'Via Pietro Bembo 20, 20161 Milano'
	}, (err,results) => {
		if(err) {
			return console.log('Non riesco ad inserire Users', err);
		}
		//console.log(JSON.stringify(results.ops, undefined, 2));
		console.log(results.ops[0]._id.getTimestamp());
	});

	
	client.close();//Chiudo la connessione
});