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

  /* ADD CLIENT TO DATA STRUCTURE */

  roles.addClient(socket);

  /* DISABLE CONTROLLER IF ALREADY ASSIGNED */

  if (roles.controller) {
    socket.emit('controllerAssigned');
  }

  /* TREAT ROLE REQUEST */

  const evaluateGameStart = (role) => {
    if (roles.controller && !roles.hasScreens()) {
      roles.controller.emit('setupController');
      let index = 1;
      roles.screens.forEach((client) => {
        client.emit('setupScreen', index, roles.screens.size);
        index += 1;
      });
    } else {
      if (role === 'controller') {
        roles.controller.emit('wait', role);
      }
      if (role === 'screen') {
        roles.screens.forEach((socket) => {
          socket.emit('wait', role);
        });
      }
    }
  };

  const handleEventEmit = (role) => {
    if (!gameStarted) {
      evaluateGameStart(role);
    } else {
      if (role === 'controller') {
        return socket.emit('setupController');
      }
      if (role === 'screen') {
        return socket.emit('setupScreen', roles.screens.size, roles.screens.size);
      }
    }
  }

  socket.on('registrationRequest', (role) => {
    switch (role) {
      case 'screen':
        roles.addScreen(socket);
        handleEventEmit(role);
        break;
      case 'controller':
        if (roles.controller) {
          return socket.emit('registrationError');
        }
        roles.controller = socket;
        roles.unregisteredClients.forEach((socket) => {
          socket.emit('controllerAssigned');
        });
        handleEventEmit(role);
        break;
      default:
        throw new Error('Unknown role');
    }
  });

  /* TREAT CLIENT DISCONNECT */

  socket.on('disconnect', () => {
    if (roles.controller === socket) {
      roles.controller = null;
      roles.unregisteredClients.forEach((socket) => {
        socket.emit('controllerReleased');
      });
    } else if (roles.screens.has(socket)) {
      roles.screens.delete(socket);
      if (gameStarted) {
        let index = 1;
        roles.screens.forEach((socket) => {
          socket.emit('updateScreenNumbers', index, roles.screens.size)
          index += 1;
        });
      }
    }
  });

  /* FORWARD GYROSCOPE DATA TO SCREENS */

  socket.on('gyroscope', (x, y) => {
    roles.screens.forEach((client) => {
      client.emit('gyroscope', x, y);
    })
  });

  // /* HANDLE SCREEN EXIT OF BALL */
  // socket.on('exit', (direction, xFraction, yFraction) => {
  //   if (direction === 'left') {
  //     roles.activeScreen -= 1;
  //   } else if (direction === 'right') {
  //     roles.activeScreen += 1;
  //   }
  //   roles.activeScreen.emit('enter', xFraction, yFraction);
  // });

});

server.listen(3000, () => {
  console.log(`listening on *:${server.address().port}`);
});