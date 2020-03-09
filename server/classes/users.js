class Users {
  constructor() {
    this.people = [];
  }

  addUser(id, name, room) {
    let user = { id, name, room };

    this.people.push(user);

    return this.getUsersByRoom(room);
  }

  getUserById(id) {
    let user = this.people.filter(person => person.id === id)[0];

    return user;
  }

  getAllUsers() {
    return this.people;
  }

  getUsersByRoom(room) {
    return this.people.filter(user => user.room === room);
  }

  removeUser(id) {
    let user = this.getUserById(id);

    this.people = this.people.filter(person => person.id !== id);

    return user;
  }
};

module.exports = { Users };