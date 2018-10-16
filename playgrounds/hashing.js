const {SHA256} = require('crypto-js'); //integro il modulo di criptazione a 256 cifre previsto nel modulo

var message = "Io sono l\'utente numero 3";// stringa da convertire
var hash = SHA256(message).toString(); //il metodo mi restituisce un oggetto, lo converto in stringa

console.log(`Message: ${message}`);
console.log(`Message: ${hash}`);

var data = {
	id : 4
};
var token = {
	data,
	hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //La stringa somesecret deve essere aggiunta per aumentare il ivello di sicurezzadell'hashing,
}

/*token.data.id = 5;
token.has = SHA256(JSON.stringify(token.data)).toString();*/


//Con questo creo l'hash dell'id presente nel token di cui ho gia creato l'hash di verifica e controllo che sia uguale a quello salvato nel token
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash){
	console.log('Valore non modificato');
} else {
	console.log('Il valore è stato modificato. Non fidarti!');
}