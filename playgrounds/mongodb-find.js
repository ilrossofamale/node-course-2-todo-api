const {MongoClient, ObjectID} = require('mongodb');





MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
	if(err) {
		//se non usassi il return il programma andrebbe avanti con l'esecuzione
		return console.log('Non riesco a connetrmi a MongoDB');
	}
	console.log('Connessione a MongoDB riuscita!');
	const db = client.db('TodoApp');


	//Con questa query visualizzo TUTTI i "record" di una collezione
	/*db.collection('Todos').find().toArray().then((docs)=>{ //toArray mi restituisce una promise quindi posso usare then

		console.log('Todos:');
		console.log(JSON.stringify(docs, undefined, 2));

	}, (err) => {
		console.log('Non riesco a recuperare i dati', err);
	});*/


	//Con questa query visualizzo i "record" DA COMPLETARE di una collezione
	/*db.collection('Todos').find({completed:false}).toArray().then((docs)=>{ //toArray mi restituisce una promise quindi posso usare then

		console.log('Todos:');
		console.log(JSON.stringify(docs, undefined, 2));

	}, (err) => {
		console.log('Non riesco a recuperare i dati', err);
	});*/

	//Con questa query visualizzo i "record" in base a _id di una collezione
	/*db.collection('Todos').find({
		_id: new ObjectID('5b34acebe4272917b8d7b841')
	}).toArray().then((docs)=>{ //toArray mi restituisce una promise quindi posso usare then

		console.log('Todos:');
		console.log(JSON.stringify(docs, undefined, 2));

	}, (err) => {
		console.log('Non riesco a recuperare i dati', err);
	});*/

	//Con questa query visualizzo il numero di "record" di una collezione
	/*db.collection('Todos').find().count().then((count)=>{ //count mi restituisce una promise quindi posso usare then
		console.log(`Todos count: ${count}`);
	}, (err) => {
		console.log('Non riesco a recuperare i dati', err);
	});*/


	//Con questa query visualizzo i "record" che hanno come name = Marco
	db.collection('Users').find({name:'Marco'}).toArray().then((docs)=>{ //count mi restituisce una promise quindi posso usare then

		console.log(`Utenti che si chiamano Marco:`);
		console.log(JSON.stringify(docs, undefined, 2));
	
	}, (err) => {
		console.log('Non riesco a recuperare i dati', err);
	});

	//client.close();//Chiudo la connessione
});