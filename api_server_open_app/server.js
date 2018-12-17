 var express = require('express');
 var mongoose = require('mongoose');
 var bodyParser = require('body-parser'); 
 var cookieParser = require('cookie-parser'); 

 /** Internal modules **/
 var config = require('./private/config'); 
 var statusController = require('./controllers/StatusController'); 
 /** Database setup **/
 mongoose.connect(config.DB_PATH);

 /** App Setup **/
 var app = express();
 
 app.use(bodyParser.urlencoded({ extended: false})); 

 /** Routing **/  
 app.use('/api', statusController);
 app.all('*', function (req, res){
 	res.status(403).send('403 - Forbidden');
 })
 
 var port = config.PORT || 3000;
 app.listen(port)

 console.log('\n--- App Informations ---');
 console.log('  Port:',port);
 console.log('  Database:',config.DB_PATH); 

 
