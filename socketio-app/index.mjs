import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static('modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

import Roles from './modules/roles.mjs';

const roles = new Roles();

let gameStarted = false;

io.on('connection', (socket) => {

  /* ADD SOCKET TO UNREGISTERED CLIENTS */

  roles.addClient(socket);

  /* INFORM SOCKET IF CONTROLLER IS ALREADY ASSIGNED */

  if (roles.controller) {
    socket.emit('controllerAssigned');
  }

  /* TREAT ROLE REQUEST */

  const evaluateGameStart = (role) => {
    if (roles.controller && roles.hasScreens()) {
      roles.controller.emit('setupController');
      roles.screens.forEach((client) => {
        client.emit('setupScreen', roles.screenIndex(client) + 1, roles.nScreens());
      });
      gameStarted = true;
    } else {
      socket.emit('wait', role);
    }
  };

  socket.on('registrationRequest', (role) => {
    switch (role) {
      case 'screen':
        roles.removeClient(socket);
        roles.addScreen(socket);
        if (gameStarted) {
          socket.emit('setupScreen', roles.screenIndex(socket) + 1, roles.nScreens());
          roles.screens.forEach((client) => {
            client.emit('updateScreenOrder', roles.screenIndex(client) + 1, roles.nScreens());
          });
          return;
        }
        evaluateGameStart(role);
        break;

      case 'controller':
        if (roles.controller) {
          return socket.emit('registrationError');
        }
        roles.removeClient(socket);
        roles.controller = socket;
        roles.unregisteredClients.forEach((client) => {
          client.emit('controllerAssigned');
        });
        evaluateGameStart(role);
        break;

      default:
        throw new Error('Unknown role');
    }
  });

  /* TREAT SOCKET DISCONNECT */

  socket.on('disconnect', () => {
    switch (true) {
      case roles.containsClient(socket):
        roles.removeClient(socket);
        break;

      case roles.controller === socket:
        roles.controller = null;
        roles.unregisteredClients.forEach((client) => {
          client.emit('controllerReleased');
        });

        if (gameStarted) {
          gameStarted = false;
          roles.screens.forEach((client) => {
            client.emit('wait', 'screen');
          });
        }
        break;

      case roles.containsScreen(socket):
        const isActive = roles.activeScreen === socket;
        roles.removeScreen(socket);
        if (gameStarted) {
          if (roles.hasScreens()) {
            roles.screens.forEach((client) => {
              client.emit('updateScreenOrder', roles.screenIndex(client) + 1, roles.nScreens());
            });
            if (isActive) {
              roles.setActiveScreen('reset');
              roles.activeScreen.emit('enter', 'reset');
            }
          } else {
            gameStarted = false;
            roles.controller.emit('wait', 'controller');
          }
        }
        break;

        default:
          throw new Error('Socket is not assigned to any data structure');
    }
  });

  /* FORWARD GYROSCOPE DATA TO SCREENS */

  socket.on('gyroscopeData', (x, y) => {
    roles.screens.forEach((client) => {
      client.emit('gyroscopeData', x, y);
    });
  });

  /* HANDLE SCREEN EXIT OF BALL */

  socket.on('exit', (direction, yFraction, screenIndex) => {
    roles.setActiveScreen(direction, screenIndex);
    roles.activeScreen.emit('enter', direction, yFraction);
  });

});

server.listen(3000, () => {
  console.log(`listening on *:${server.address().port}`);
});