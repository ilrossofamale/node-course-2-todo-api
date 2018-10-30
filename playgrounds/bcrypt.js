const {SHA256} = require('crypto-js'); //integro il modulo di criptazione a 256 cifre previsto nel modulo
const jwt = require('jsonwebtoken');//modulo di verifica hashing
const bcrypt = require('bcryptjs');//modulo di encrypt


var password = '123abc!';


bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	})
});

var hashedPassword = '$2a$10$it5WxUky/bU1SPlpE.Hur.N6t./fLdOkzev8IIQ.44yYZy.zvFNZm';


bcrypt.compare(password, hashedPassword, (err, res) => {
	console.log(res);
});