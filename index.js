var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000, function(){
    console.log('listening to port 3000');
});

app.use(express.static('public'));

var io = socket(server);

function handleCommand(socket, message, room, username) {
    const args = message.slice(1).split(' '); // Remove '/' and split
    const command = args[0].toLowerCase();

    switch(command) {
        case 'help':
           
            socket.emit('chat', {
                handle: 'System Bot',
                message: 'Available commands: /help, /random, /time, /users'
            });
            break;

         case 'random':
            const randomNum = Math.floor(Math.random() * 100) + 1;
            io.emit('chat', { 
                handle: 'System Bot',
                message: `${username} rolled a ${randomNum}! `
            });
            break;

        case 'time':
            const currentTime = new Date().toLocaleTimeString();
            socket.emit('chat', {
                handle: 'System Bot',
                message: `Current time is: ${currentTime} `
            });
            break;

        case 'users':
            socket.emit('chat', {
                handle: 'System Bot',
                message: 'User list feature coming soon! '
            });
            break;

        default:
            socket.emit('chat', {
                handle: 'System Bot',
                message: `Unknown command: ${command}. Type /help for available commands.`
            });
    }
}

io.on('connection', function(socket){
    console.log('made socket connection', socket.id);

    socket.on('chat', function(data){
    if (data.message.startsWith('/')) {
        handleCommand(socket, data.message, 'general', data.handle);
    } else {
        io.emit('chat', data);
    }
});

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('stopTyping', function(){
        socket.broadcast.emit('stopTyping'); 
    });

});