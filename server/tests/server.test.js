const expect = require('expect'); //invoco il modulo per i test
const request = require('supertest'); //invoco il modulo per le asserzioni sui test
const {ObjectId} = require('mongodb');



const {app} = require('./../server'); //chiamo i file locali
const {Todo} = require('./../models/todo'); //chiamo i file locali

//Array dummy di todos per fverifica funzionalità get
const todos = [{
	_id: new ObjectId,
	text: "Primo testo todo test"
},{
	_id: new ObjectId,
	text: "Secondo testo todo test"
}];


//questa funzione mi serve per far validare l'assertiona riga 42, prima di ogni test svuoto il db e gli inietto l'arrey dummy
beforeEach((done) => {
	Todo.remove({}).then(() => {
		Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('Crea una nuova attività', (done) => {// il parametro done va passato perchè viene utilizzzato per funzioni di tipo asincrono altrimenti il test finisce in maniera sincrona e non viene eseguito
		var text = 'TEST attività testo';
		//request del test
		request(app)// request verso l'oggetto app esportato da server.js che devo testare
		.post('/todos') // URL a cui PASSARE I DATI
		.send({text})// definisco COSA PASSARE attraverso la definizioned di un oggetto che verrà automticamente trasformato in json dalla suite "supertest"
		//iniziano le assertion da effettuare sulla request appena fatto
		.expect(200)// verifico l'avvenuta risposta
		.expect((res) => {// crea una assertion da effettuare sul corpo della risposta
			expect(res.body.text).toBe(text); //metodo definito in supertest
		})
		.end((err, res) => { //invece della classica chiusura "done" eseguo una funzione che interroga il db per verificare cosa sia stato scritto nella collection di mongo db
			if(err) {
				return done(err);//se presente un errore chido il test e mi facio restituire il tipo di errore
			}
			//eseguo una richiesta al db per verificare l'inserimento
			Todo.find({text}).then((todos) => {//cerco il testo specifico
				expect(todos.length).toBe(1);//verifico che ne sia stata inserita una (per far funzionare questa assertion bisogna che il DB sia sempre vuoto quindi definisco la funzione beforeEach a riga 19)
				expect(todos[0].text).toBe(text);//verifico che l'ultimo testo inserito sia il testo utilizzato lungo il test
				done();

			}).catch((e) => done(e));
		})
	});
	it('Non deve Creare una nuova attività con un data body invalido', (done) => {
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			Todo.find().then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((e) => done(e))
		})
	});
});


describe('GET /todos', () => {

	it('Dovrei avere tutti i todos', (done) => {
		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2)
		})
		.end(done);
	})

})

describe('GET /todos:id', () => {

	it('Restituisce un documetno in base all\'id', (done) => {

		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)//todos[0]._id è un oggetto, il metodo toHexString lo converte (mongodb reference)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});



	it('Documento non trovato 404', (done) => {
		var hexId = new ObjectId().toHexString();
		request(app)
		.get(`/todos/${hexId}`)
		.expect(404)
		.end(done);

	});

	it('Documento non trovato id non valido 404', (done) => {
		request(app)
		.get('/todos/123abc')
		.expect(404)
		.end(done);


	});



});