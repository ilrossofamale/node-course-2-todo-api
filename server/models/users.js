const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//DEFINIZIONE DELLA STRUTTA DEI DATI PER L'UTENTE
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
	var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();//process.env.JWT_SECRET questa variabile è nel file di configurazione
	user.tokens.push({access,token});
	return user.save().then(() => {
		return token
	})
};

UserSchema.statics.findByToken = function (token){
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token,process.env.JWT_SECRET);//process.env.JWT_SECRET questa variabile è nel file di configurazione
	} catch(e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});

}

UserSchema.statics.findByCredential = function (email,password) {
	var User = this;

	return User.findOne({email}).then((user) => {
		if(!user) {
			return Promise.reject();
		}

		//scrivo uno custom Promise perchè il metodo bcrypt che utilizzerò non le utilizza ma si basa su callback
		return new Promise( (resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res) {
					resolve(user);
				} else {
					reject();
				}
			});
		})

	})
}

UserSchema.methods.removeToken = function (token) {
	var user = this;
	return user.update({
		$pull: {
			tokens : {token}
		}
	})
}

UserSchema.pre('save', function(next) { //middleware di mongoose
	var user = this;

	if(user.isModified('password')) {

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			})
		});
	} else {
		next();
	}
});

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