const {SHA256} = require('crypto-js'); //integro il modulo di criptazione a 256 cifre previsto nel modulo
const jwt = require('jsonwebtoken');//modulo di verifica hashing

var data = {
	id: 10
};

var token = jwt.sign(data, '123abc');		//creo il token invocando il metodo sign che riceve il valore di cui fare l'hash (data) e , gli associa il valore della stringa secret (123abc)
console.log(token);

var decoded = jwt.verify(token, '123abc')	//verifico l'utente invocando il metodo verify che riceve il valore del token e la chiave segreta restituendomi l'id utente
console.log(decoded);