const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const projectRoutes = require('./routes/project');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Маршруты API
app.use('/api/projects', projectRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.send('Сервер работает. Попробуйте открыть /api/projects');
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
