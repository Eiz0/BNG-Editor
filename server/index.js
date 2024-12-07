const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const projectRoutes = require('./routes/project');
const { WebSocketServer } = require('ws');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Маршруты API
app.use('/api/projects', projectRoutes);

// Обработка корневого маршрута
app.get('/', (req, res) => {
  res.send('Сервер работает. Это WebSocket-сервер. Подключайтесь через WebSocket.');
});

// Создание WebSocket-сервера
const wss = new WebSocketServer({ noServer: true });

// Хранилище подключений WebSocket
const clients = new Set();

// Обработка WebSocket-соединений
wss.on('connection', (ws) => {
  console.log('Новое WebSocket-соединение');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Получено сообщение:', data);

      // Рассылаем сообщение всем клиентам
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('Ошибка обработки сообщения:', err);
    }
  });

  ws.on('close', () => {
    console.log('Соединение WebSocket закрыто');
  });
});



// Подключение WebSocket к серверу Express
const server = app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
