var net = require('net');
var sockets = [];
var client_index = 0;

// Configuration parameters
var HOST = 'localhost';
var PORT = 8000;

// Create Server instance 
var server = net.createServer(onClientConnected);

function onClientConnected(socket) {
    client_index++;
    socket.id = Math.floor(Math.random() * 1000);

    socket.nickname = "Open_App_Client_" + client_index;
    var clientName = socket.nickname;

    sockets.push(socket);

    // Log the client to server
    console.log(clientName + ' joined this chat.');

    // Welcome user to the socket server
    socket.write("Welcome to telnet chat!\n");

    // Broadcast to others excluding this socket
    broadcast(clientName, clientName + ' joined this chat.\n');


    // When client sends data
    socket.on('data', function (data) {
        var message = clientName + '> ' + data.toString() + "\n";

        // Notify all clients
        broadcast(clientName, message);

        // Log the server output
        process.stdout.write(message);
    });


    // On client disconnect
    socket.on('end', function () {
        var message = clientName + ' left this chat room\n';

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
        if (socket.nickname === from) return;

        socket.write(message);

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
