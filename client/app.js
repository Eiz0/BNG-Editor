const canvas = document.getElementById('canvas');
const saveButton = document.getElementById('save-project');
const loadButton = document.getElementById('load-projects');

// Добавление кнопки на canvas
document.getElementById('add-button').addEventListener('click', () => {
  const button = document.createElement('button');
  button.textContent = 'Кнопка';
  button.style.margin = '10px';
  canvas.appendChild(button);
});

// Добавление текста на canvas
document.getElementById('add-text').addEventListener('click', () => {
  const text = document.createElement('p');
  text.textContent = 'Текст';
  text.style.margin = '10px';
  canvas.appendChild(text);
});

// Сохранение проекта
async function saveProject() {
  const content = canvas.innerHTML;
  const name = prompt('Введите имя проекта:');
  if (!name) {
    alert('Имя проекта обязательно!');
    return;
  }

  console.log('Отправка данных на сервер:', { name, content }); // Проверка

  const response = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, content }),
  });

  const result = await response.json();
  console.log('Ответ сервера:', result); // Проверка

  alert(result.message);
}

// Загрузка проектов
async function loadProjects() {
  const response = await fetch('http://localhost:3000/api/projects');
  const projects = await response.json();

  canvas.innerHTML = ''; // Очистить canvas
  projects.forEach(project => {
    const projectContainer = document.createElement('div');
    projectContainer.classList.add('project-item');
    projectContainer.innerHTML = `<strong>${project.name}:</strong><br>${project.content}`;
    canvas.appendChild(projectContainer);
  });
}



// Привязка кнопок
saveButton.addEventListener('click', saveProject);
loadButton.addEventListener('click', loadProjects);
