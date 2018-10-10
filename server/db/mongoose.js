var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //In questo modo dico a Mongoose di usare le Promise
mongoose.connect(process.env.MONGODB_URI);


module.exports = {mongoose};