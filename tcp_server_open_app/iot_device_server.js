//TCP does not send messages "separately". TCP is a stream protocol, which means that when you write bytes to the socket, you get the same bytes in the same order at the receiving end. There is no notion of "message boundaries" or "packets" anything of the sort.

var net = require('net');
var http = require('http');
var data_server_url = "http://localhost:3000/api/";

var sockets = [];

// Configuration parameters
var HOST = 'localhost';
var PORT = 8000;

// Create Server instance 
var server = net.createServer(onClientConnected);

function onClientConnected(socket) {
    socket.id = Math.floor(Math.random() * 1000);
    socket.username = "Open_App_Client_" + socket.id;
    var clientName = socket.username;

    sockets.push(socket);

    // Register to data server
    http.get(data_server_url + "status/create?username=" + clientName + "&client_id=" + socket.id, function (response) {
        var buffer = "";

        response.on("data", function (chunk) {
            buffer += chunk;
        });

        response.on("end", function (err) {
            socket.write("Data saved to server");
        });
        // console.log("data buffer: ",buffer);
    });

    // Log the client to server
    console.log(clientName + ' joined this chat and client_id: ' + socket.id);

    // Welcome user to the socket server
    socket.write(`Hi ${socket.username}, \nWelcome to telnet chat!\n`);

    // Broadcast to others excluding this socket
    broadcast(clientName, clientName + ' joined this chat.\n');

    socket.setEncoding('utf8');

    // When client sends data
    socket.on('data', function (data) {
        var message = clientName + '> ' + data.toString() + "\n";

        // receiver client
        //	var receiver= "Open_App_Client_1";
        //  var message = clientName + ' sent to '+ receiver +' msg> ' + data.toString() + "\n";
        // Notify all clients
        broadcast(clientName, message);
        //sendTo(clientName, receiver, message)
        // Log the server output
        process.stdout.write(message);
    });


    // On client disconnect
    socket.on('end', function () {
        var message = clientName + ' left this chat room\n';
        // Register to data server
        http.get(data_server_url + "status/update/" + clientName + "?flag=2", function (response) {
            var buffer = "";

            response.on("data", function (chunk) {
                buffer += chunk;
            });

            response.on("end", function (err) {
                socket.write("Data saved to server");
            });
            // console.log("data buffer: ",buffer);
        });
        // Log the server output
        process.stdout.write(message);

        // Clear this client from list
        removeSocket(socket);

        // Notify all clients
        broadcast(clientName, message);
    });


    // When socket gets errors
    socket.on('error', function (error) {
        console.log('Socket got problems: ', error.message);
    });
};


// Broadcast to others, excluding the sender
function broadcast(from, message) {
    // No receiver
    if (sockets.length === 0) {
        process.stdout.write('Empty Room');
        return;
    }

    // Receiver exist
    sockets.forEach(function (socket, index, array) {
        // Ignoring the sender
        if (socket.username === from) return;

        socket.write(message);

    });

};


// Send to sepcified user
function sendTo(from, to, message) {
    // Empty
    if (sockets.length === 0) {
        process.stdout.write('Empty Room');
        return;
    }

    sockets.forEach(function (socket, index, array) {
        // Sending to perticular user
        if (socket.username === to) {
            socket.write(message);
        } else {
            process.stdout.write(`${to} doesn't exist on the server`);
        }
    });

};

// Deleting disconnected client
function removeSocket(socket) {
    sockets.splice(sockets.indexOf(socket), 1);
};


// Listening for server Error
server.on('error', function (error) {
    console.log("Ohh problem!", error.message);
});

// Listen for a port to telnet to
// then in the terminal just run 'telnet localhost [port]' 
server.listen(PORT, HOST, function () {
    console.log('server listening on %j', server.address());
});
