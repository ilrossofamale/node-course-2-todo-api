var mongoose = require('mongoose');

//DEFINISCO LO SCHEMA DELLA COLLEZIONE
const Users = mongoose.model('Users',{
	email: {
		type: String,
		require: true,
		minlength: 1,
		trim: true
	}
});

module.exports = {Users};