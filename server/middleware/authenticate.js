var {Users} = require('./../models/users');


var authenticate = (req, res, next)=>{
	var token = req.header('x-auth');
	Users.findByToken(token).then((user) => {
		if(!user){
			return Promise.reject();
		}
		req.user = user;
		req.token = token;
		next();//invoco next per far proseguire la funzione visto che la funzione authenticate è un middleware
	}).catch((e) => {
		res.status(401).send();
	});
}

module.exports = {authenticate};