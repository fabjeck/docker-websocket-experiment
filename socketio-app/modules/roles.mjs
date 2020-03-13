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

  addScreen(client) {
    this.unregisteredClients.delete(client.id);
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
    if (direction === 'left') {
      console.log('left');
      this._activeScreen = this._activeScreen - 1;
    } else if (direction === 'right') {
      this._activeScreen = this._activeScreen + 1;
    } 
  }

  get activeScreen() {
    console.log(this._activeScreen);
    return this.screens[this._activeScreen];
  }

  get controller() {
    return this._controller;
  }

  set controller(client) {
    this._controller = client;
  }

  hasController() {
    return this._controller != null;
  }
}