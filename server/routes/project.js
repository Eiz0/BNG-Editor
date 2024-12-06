const express = require('express');
const router = express.Router();

const projects = []; // Временное хранилище для проектов

// Маршрут для получения списка проектов
router.get('/', (req, res) => {
  res.json(projects);
});

// Маршрут для добавления нового проекта
router.post('/', (req, res) => {
  const project = req.body;
  projects.push(project);
  res.status(201).json({ message: 'Проект сохранен', project });
});

module.exports = router; // Экспорт маршрутов
