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

let screens = new Array();
let controller = null;

let gameStarted = false;


io.on('connection', (socket) => {

  /* DISABLE CONTROLLER IF ALREADY ASSIGNED */

  if (controller) {
    socket.emit('controllerAssigned');
  }

  /* TREAT ROLE REQUEST */

  const informClients = () => {
    const waitingClients = screens.concat(controller);
    if (controller && screens.length >= 1) {
      waitingClients.forEach((client) => {
        io.to(client).emit('start', screens.indexOf(client) + 1);
      });
    } else {
      waitingClients.forEach((client) => {
        io.to(client).emit('wait');
      });
    }
  }

  socket.on('clientRegistration', (role) => {
    switch (role) {
      case 'screen':
        screens.push(socket.id);
        socket.emit('registration', true, role);
        if (!gameStarted) {
          informClients();
          gameStarted = true;
        } else {
          socket.emit('start', screens.indexOf(socket.id) + 1);
        }
        break;
      case 'controller':
        if (controller) {
          return socket.emit('registration', false);
        }
        controller = socket.id;
        socket.emit('registration', true, role);
        socket.broadcast.emit('controllerAssigned');
        informClients();
        break;
      default:
        throw new Error('Unknown role');
    }
  });

  /* TREAT CLIENT DISCONNECT */

  socket.on('disconnect', () => {
    if (socket.id === controller) {
      controller = null;
      socket.broadcast.emit('controllerReleased');
    } else if (screens.includes(socket.id)) {
      screens = screens.filter((id) => {
        id === socket.id;
      });
      screens.forEach((screen) => {
        io.to(screen).emit('updateScreenPosition', screens.indexOf(screen) + 1);
      });
    }
  });

  /* FORWARD GYROSCOPE DATA TO SCREENS */
  
  socket.on('gyroscope', (x, y) => {
    screens.forEach((screen) => {
      io.to(screen).emit('gyroscope', x, y);
    })
  });

});

server.listen(3000, () => {
  console.log(`listening on *:${server.address().port}`);
});