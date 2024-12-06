const express = require('express');
const router = express.Router();

// Временное хранилище для проектов
let projects = [];

// Получение всех проектов
router.get('/', (req, res) => {
  res.json(projects);
});

// Сохранение нового проекта
router.post('/', (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Name and content are required' });
  }

  const newProject = { id: Date.now(), name, content };
  projects.push(newProject);

  res.status(201).json({ message: 'Проект сохранен', project: newProject });
});

// Удаление проекта (опционально)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  projects = projects.filter(project => project.id !== parseInt(id, 10));
  res.status(200).json({ message: 'Проект удален' });
});

module.exports = router;
