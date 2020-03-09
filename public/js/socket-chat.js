var socket = io();

const params = new URLSearchParams(window.location.search);

if (!params.get('name') || !params.get('room')) {
	window.location = 'index.html';
	throw new Error('El nombre y sala es necesario');
}

var user = {
  name: params.get('name'),
  room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('enterChat', user, function (res) {
			console.log(res);
		});
});

// escuchar
socket.on('disconnect', function() {
  console.log('Perdimos conexión con el servidor');
});


// Enviar información
/* socket.emit('sendMessage', {
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar cuando servidor envía mensaje
socket.on('sendMessage', function(mensaje) {
  console.log('Servidor:', mensaje);
});

socket.on('listUsers', function(users) {
  console.log('Actualización de grupo:', users);
});

// Private message
socket.on('directMessage', function(message) {
	console.log('Mensaje directo:', message);
})