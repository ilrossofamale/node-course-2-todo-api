var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
	var config = require("./config.json");				//richiamo il json di configurazione
	var envConfig = config[env];						//estraggo la configurazione in base al nome della variabile env definita dal sistema (locale/heroku)
	Object.keys(envConfig).forEach((key) => { 			//estraggo le chiavi, presenti nel json e creo un ciclo in base al loro numero; key = la chiave (restituita dal metodo .keys() ) viene passata come unico parametro alla callback del ciclo
		process.env[key] = envConfig[key]; 				//In questo modo setto la variabile contenuta nell'oggetto process, avente il nome key, uguale alla variabile con nome key nell'oggetto envConfig. La notazione con [] è come dire process.env.key = envConfig.key
	});
}