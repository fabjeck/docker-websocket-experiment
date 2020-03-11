import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static('modules'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let screens = new Array();
let activeScreen = 0;
let controller = null;

io.on('connection', (socket) => {
  if (controller) {
    socket.emit('controllerAssigned');
  }

  socket.on('clientRegistration', (role) => {
    switch (role) {
      case 'screen':
        screens.push(socket.id);
        socket.emit('registration', true);
        if (screens.length === 1) {
          socket.emit('draw', null);
        }
        break;
      case 'controller':
        if (controller) {
          socket.emit('registration', false);
          socket.emit('controllerAssigned');
        }
        controller = socket;
        socket.emit('registration', true);
        io.sockets.emit('controllerAssigned');
        break;
      default:
        throw new Error('Unknown role');
    }
  });

  socket.on('disconnect', () => {
    if (socket === controller) {
      controller = null;
      socket.broadcast.emit('controllerReleased');
    } else if (screens.includes(socket.id)) {
      screens = screens.filter((id) => {
        id === socket.id;
      });
    }
  });

  socket.on('sensorData', (data) => {
    screens.forEach((id) => {
      io.to(id).emit('sensorData', data);
    });
  });

  socket.on('exit', (data) => {
    switch (data.dir) {
      case 'left':
        if (activeScreen === 0) {
          activeScreen = screens.length - 1;
        } else {
          activeScreen -= 1;
        }
        break;
      case 'right':
        if (activeScreen === screens.length - 1) {
          activeScreen = 0;
        } else {
          activeScreen += 1;
        }
        break;
    }
    io.to(screens[activeScreen]).emit('draw', {x: data.x, y: data.y});
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});