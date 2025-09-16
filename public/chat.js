

var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');


btn.addEventListener('click', function(){
    if (message.value.trim() === '') {
        return; 
    }

    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
    
});

message.addEventListener('keypress', function(){
    if (!typing) {
        typing = true;
        socket.emit('typing', handle.value);
    }
    clearTimeout(timeout);
    timeout = setTimeout(stopTyping, 1000); 
});

message.addEventListener('keyup', function() {
    clearTimeout(timeout);
    timeout = setTimeout(stopTyping, 1000);
});

function stopTyping() {
    if (typing) {
        typing = false;
        socket.emit('stopTyping'); 
    }
}

socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('stopTyping', function(){
    feedback.innerHTML = '';
});