const express = require('express');
const bodyParser = require('body-parser');
const projectRoutes = require('./routes/project'); // Подключение маршрута

const app = express();

// Middleware
app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api/projects', projectRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
