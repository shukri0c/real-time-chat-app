var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000, function(){
    console.log('listening to port 3000');
});

app.use(express.static('public'));

var io = socket(server);

io.on('connection', function(socket){
    console.log('made socket connection', socket.id);
});