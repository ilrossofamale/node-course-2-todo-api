const expect = require('expect'); //invoco il modulo per i test
const request = require('supertest'); //invoco il modulo per le asserzioni sui test
const {ObjectId} = require('mongodb');



const {app} = require('./../server'); //chiamo i file locali
const {Todo} = require('./../models/todo'); //chiamo i file locali
const {Users} = require('./../models/users'); //chiamo i file locali
const {todos,populateTodos,users,populateUsers}  = require('./seed/seed.js'); //chiamo i file locali



//creo i dummy secondo le impostazioni dei modelli
beforeEach(populateUsers);
beforeEach(populateTodos);

//I TEST!!!
describe('POST /todos', () => {
	it('Crea una nuova attività', (done) => {// il parametro done va passato perchè viene utilizzzato per funzioni di tipo asincrono altrimenti il test finisce in maniera sincrona e non viene eseguito
		var text = 'TEST attività testo';
		//request del test
		request(app)// request verso l'oggetto app esportato da server.js che devo testare
		.post('/todos') // URL a cui PASSARE I DATI
		.set('x-auth',users[0].tokens[0].token) //Autenticazione attraverso il token
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
		.set('x-auth',users[0].tokens[0].token) //Autenticazione attraverso il token
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
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(1)
		})
		.end(done);
	})

})

describe('GET /todos:id', () => {

	it('Restituisce un documento in base all\'id', (done) => {
		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)//todos[0]._id è un oggetto, il metodo toHexString lo converte (mongodb reference)
		.set('x-auth',users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);
	});

	it('Non Restituisce un documento in base all\'id creato da un \'altro utente', (done) => {
		request(app)
		.get(`/todos/${todos[1]._id.toHexString()}`)//todos[0]._id è un oggetto, il metodo toHexString lo converte (mongodb reference)
		.set('x-auth',users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('Documento non trovato 404', (done) => {
		var hexId = new ObjectId().toHexString();
		request(app)
		.get(`/todos/${hexId}`)
		.set('x-auth',users[0].tokens[0].token)
		.expect(404)
		.end(done);

	});

	it('Documento non trovato id non valido 404', (done) => {
		request(app)
		.get('/todos/123abc')
		.set('x-auth',users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});
});



describe('DELETE /todos/:id', () => {
	it('Dovrebbe cancellare il documento', (done) => {
		var hexId = todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth',users[1].tokens[0].token)
		.expect(200)
		.expect((res)=> {
			expect(res.body.todo._id).toBe(hexId);
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo).toNotExist();
				done();
			}).catch((e) => done(e));
		})
	});

	it('Non Dovrebbe cancellare il documento di un\'altro', (done) => {
		var hexId = todos[0]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth',users[1].tokens[0].token)
		.expect(404)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo).toExist();
				done();
			}).catch((e) => done(e));
		})
	});

	it('Restituisce 404 se il documento non esiste', (done) => {
		var hexId = new ObjectId().toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth',users[1].tokens[0].token)
		.expect(404)
		.end(done);

	});

	it('Restituisce 404 se l\'id non è valido', (done) => {
		request(app)
		.delete('/todos/123abc')
		.set('x-auth',users[1].tokens[0].token)
		.expect(404)
		.end(done);
	});
});


describe('PATCH /todos/:id', () => {

	it('Dovrebbe aggiornare todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'nuovo testo del TEST';
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth',users[0].tokens[0].token)
		.send({
			completed: true,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(true);
			expect(res.body.todo.completedAt).toBeA('number');
		})
		.end(done);
	});

	it('Non Dovrebbe aggiornare todo di un\'altro utente', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = 'nuovo testo del TEST';
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth',users[1].tokens[0].token)
		.expect(404)
		.end(done);
	});


	it('Dovrebbe cancellare completedAt se il task non è completo', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = 'nuovo testo del TEST!!!';
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth',users[1].tokens[0].token)
		.send({
			completed: false,
			text
		})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text);
			expect(res.body.todo.completed).toBe(false);
			expect(res.body.todo.completedAt).toNotExist();
		})
		.end(done);
	});
});


describe('GET /users/me', () => {

	it('Restituisce se l\'utene è autenticato', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth',users[0].tokens[0].token)//se utente è autenticato ha settato questo parametro
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('Restituisce 401 se l\'utene non è autenticato', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});
		})
		.end(done);
	});

});


describe('POST /users', () => {

	it('Creare utente', (done) => {
		//test se passo dati validi
		var email = 'example@example.com';
		var password = '123mnb!';
		request(app)
		.post('/users')
		.send({email,password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist();
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			//invece di end(done) e chiudere il test utilzzo questo funzione custom per verificare i dati, non solo la loro esistenza
			if(err){
				return done(err);
			}
			Users.findOne({email}).then((user) => {
				expect(user).toExist();
				expect(user.password).toNotBe(password);//confronto la variabile password con la password salvata per verificare che quella nel db sia codificata
				done();
			}).catch( (e) => done(e));
		});
	});

	it('Restituira errore di validazione se la richiesta è invalida', (done) => {
		//test se i dati non sono validi
		//email o password non validi
		request(app)
		.post('/users')
		.send({
			email : 'example#example.com',
			password : 'mnb!'
		})
		.expect(400)
		.end(done);
	});

	it('Non crea utente se la mail è duplicata', (done) => {
		//controlla unicità della mail
		request(app)
		.post('/users')
		.send({
			email : users[0].email,
			password : '123abc!'
		})
		.expect(400)
		.end(done);
	});

});


describe('POST /users/login', () => {
	it('dovrebbe loggarsi e restituire il token', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email:users[1].email,
			password: users[1].password
		})
		.expect(200)
		.expect((res) => {
			expect(res.header['x-auth']).toExist();
		})
		.end((err, res) => {
			if (err) {
				done(err);
			}
			Users.findById(users[1]._id).then((user)=>{
				expect(user.tokens[1]).toInclude({
					access: 'auth',
					token: res.header['x-auth']
				})
				done();
			}).catch( (e) => done(e));
		})

	});

	it('dovrebbe rifiutare il login invalid password', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email:users[1].email,
			password: users[1].password + '1'
		})
		.expect(400)
		.expect((res) => {
			expect(res.header['x-auth']).toNotExist();
		})
		.end((err, res) => {
			if (err) {
				done(err);
			}
			Users.findById(users[1]._id).then((user) => {
				expect(user.tokens.length).toBe(1);
				done();
			}).catch( (e) => done(e));
		})
	});
});

describe('DELETE /users/me/tokens',() => {

	it('Cancella token', (done) => {

		request(app)
		.delete('/users/me/token')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			Users.findById(users[0]._id).then((user) => {
				expect(user.tokens.length).toBe(0);
				done();
			}).catch( (e) => done(e));
		});
	})
})