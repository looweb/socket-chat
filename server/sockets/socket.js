const { io } = require('../server');

const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {
  client.on('enterChat', (data, callback) => {

		const { name, room } = data;
		if (!name) {
			return callback({ error: true, message: 'Debe indicar un nombre' });
		}

		if (!room) {
			return callback({ error: true, message: 'Debe indicar una sala' });
		}

		client.join(room);
		let people = users.addUser(client.id, name, room);

		client.broadcast.to(room).emit('listUsers', users.getUsersByRoom(room));
		client.broadcast.to(room).emit('sendMessage', createMessage(
			'Admin', `${name} ha ingresado al chat`
		));

		callback(people);
	});

	client.on('disconnect', () => {
		const { name, room } = users.removeUser(client.id);
		client.broadcast.to(room).emit('sendMessage', createMessage(
			'Admin', `${name} ha abandonado`
		));

		client.broadcast.to(room).emit('listUsers', users.getUsersByRoom(room));

	});

	client.on('sendMessage', (data, callback) => {
		let user = users.getUserById(client.id);
		let message = createMessage(user.name, data.message);

		client.broadcast.to(user.room).emit('sendMessage', message);

		callback(message);
	})

	client.on('directMessage', (data) => {
		let from = users.getUserById(client.id);
		client.broadcast.to(data.to).emit('directMessage', createMessage(from.name, data.message));
	})
});