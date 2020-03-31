export default class Roles {
  constructor () {
    this.unregisteredClients = new Map();
    this.screens = new Array();
    this._activeScreen = 0;
    this._controller = null;
  }

  addClient(client) {
    this.unregisteredClients.set(client.id, client);
  };

  removeClient(client) {
    this.unregisteredClients.delete(client.id);
  };

  containsClient(client) {
    return this.unregisteredClients.has(client.id);
  }

  addScreen(client) {
    this.screens.push(client);
  }

  removeScreen(client) {
    this.screens = this.screens.filter((screen) => {
      return client != screen;
    });
  }

  containsScreen(client) {
    return this.screens.includes(client);
  }

  hasScreens() {
    return this.screens.length != 0;
  }

  nScreens() {
    return this.screens.length;
  }

  screenIndex(client) {
    return this.screens.indexOf(client) + 1;
  }

 set activeScreen(direction) {
   switch (direction) {
    case 'left':
      this._activeScreen -= 1;
      break;
    case 'right':
      this._activeScreen += 1;
      break;
    case 'reset':
      this._activeScreen = 0;
      break;
   }
  }

  get activeScreen() {
    return this.screens[this._activeScreen];
  }

  get controller() {
    return this._controller;
  }

  set controller(client) {
    this._controller = client;
  }
}