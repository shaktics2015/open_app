var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var users = {}; 
app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});  
app.get('/otherClient', function(req, res,next) {  
    res.sendFile(__dirname + '/otherClient.html');
});
 io.on('connection', function(client) {  

     client.on('join', function(data) {
		if(users[data.userid]){
		users[data.userid].push(client.id );
		}else{ 
		users[data.userid]=[client.id ];
		}
     });

     client.on('disconnect', function (data) {
         for (var key in users) {
             if (users.hasOwnProperty(key)) {
                 users[key].splice(client.id,1);
             }
         }
      });

    client.on('messages', function(data) {
    	if(users[data.user.userid])
        users[data.user.userid].forEach(function(identifier){
            client.to(identifier).emit('broad', data);
        });
        if(users[data.to])
        users[data.to].forEach(function(identifier){
            client.to(identifier).emit('broad', data);
        });
     });

});
 
server.listen(8080, function(){
    console.log("running on 8080");
});  