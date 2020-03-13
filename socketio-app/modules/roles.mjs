export default class Roles {
  constructor () {
    this.unregisteredClients = new Map();
    this.screens = new Set();
    this._controller = null;
  }

  addClient(client) {
    this.unregisteredClients.set(client.id, client);
  };

  addScreen(client) {
    this.unregisteredClients.delete(client.id);
    this.screens.add(client);
  }

  removeScreen(key) {
    this.screens.remove(key);
  }

  hasScreens() {
    return this.screens.size != 0;
  }

  activeScreen() {
    
  };

  get controller() {
    return this._controller;
  }

  set controller(client) {
    if (client) {
      this.unregisteredClients.delete(client.id);
    }
    this._controller = client;
  }
}