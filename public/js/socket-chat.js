var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El name y room son necesarios');
}

var usuario = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', usuario, function(resp) {
        renderUsers(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     name: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('sendMessage', function(mensaje) {
    renderMessages(mensaje);
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listUsers', function(users) {
    renderUsers(users);
});

// Mensajes privados
socket.on('privateMessage', function(mensaje) {
    console.log('Mensaje Privado:', mensaje);
});