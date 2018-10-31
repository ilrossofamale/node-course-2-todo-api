var mongoose = require('mongoose');

//DEFINISCO LO SCHEMA DELLA COLLEZIONE PER I TODO
const Todo = mongoose.model('Todo',{
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	},
	_creator: {
		require: true,
		type: mongoose.Schema.Types.ObjectId
	}
});




module.exports = {Todo};