const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = mongoose.Schema({	//NON SI POSSONO AGGIUNGERE METODI AL model, PER FARE QUESTO VA USATO Schema
	email: {
		type: String,
		require: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} email non valido'
		}
	},
	password: {
		type: String,
		require: true,
		minlength:6
	},
	tokens: [{
		access: {
			type:String,
			require: true
		},
		token: {
			type:String,
			require: true
		}
	}]
});

//Impedisco la visualizzazione dei dati nel return
UserSchema.methods.toJSON = function (){
	var user = this;	//riferito all'oggetto corrente
	var userObject = user.toObject();
	return _.pick(userObject, ['_id','email']);	//in questo modo impedisco il return di tutti i valori tranne quelli esplicitati

}

//Aggiungo il metodo allo Schema
UserSchema.methods.generateAuthToken = function(){
	var user = this;	//riferito all'oggetto corrente
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
	user.tokens.push({access,token});
	return user.save().then(() => {
		return token
	})
};

UserSchema.statics.findByToken = function (token){
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token,'abc123')
	} catch(e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});

}

//RIDICHIARO IL MODELLO PASSANDOGLI LO SCHEMA
const Users = mongoose.model('Users',UserSchema);




//SI USA Schema AL POSTO DI model PER POTER AGGIUNGERE METODI CUSTOM


//DEFINISCO IL MODELLO DELLA COLLEZIONE
/*const Users = mongoose.model('Users',{	//NON SI POSSONO AGGIUNGERE METODI AL model, PER FARE QUESTO VA USATO Schema E POI PASSATO AL model
	email: {
		type: String,
		require: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} email non valido'
		}
	},
	password: {
		type: String,
		require: true,
		minlength:6
	},
	tokens: [{
		access: {
			type:String,
			require: true
		},
		token: {
			type:String,
			require: true
		}
	}]
});*/
module.exports = {Users};