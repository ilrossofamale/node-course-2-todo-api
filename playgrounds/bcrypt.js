const {SHA256} = require('crypto-js'); //integro il modulo di criptazione a 256 cifre previsto nel modulo
const jwt = require('jsonwebtoken');//modulo di verifica hashing
const bcrypt = require('bcryptjs');//modulo di encrypt


var password = '123abc!';

//HASHING PASSWORD
bcrypt.genSalt(10, (err, salt) => { //questo metodo genera automaticamente il salt number per rendere la password più sicura
	bcrypt.hash(password, salt, (err, hash) => { //('la password selezionata, il salt number generato automaticametne, callback')
		console.log(hash);
	})
});



//COMPARE HASHING PASSWORD
var hashedPassword = '$2a$10$rlnalkcSM.Jcz0XocYcN..E1HyKpW9HZQLbv1WKqMhFIaYJvRxrna';
bcrypt.compare(password, hashedPassword, (err, res) => { //('la password selezionata, la password criptata, callback')
	console.log(!res);
});