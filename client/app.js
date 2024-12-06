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


document.getElementById('export-project').addEventListener('click', exportProject);

function exportProject() {
  const canvasContent = canvas.innerHTML; // Получаем содержимое canvas
  const styles = `
    body {
      font-family: Arial, sans-serif;
    }
    .editor-canvas {
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      padding: 10px;
    }
    button {
      margin: 10px;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
    }
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Экспортированный проект</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="editor-canvas">
        ${canvasContent}
      </div>
    </body>
    </html>
  `;

  // Создаем файл Blob
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'exported_project.html';
  link.click();
}

canvas.addEventListener('click', (event) => {
  if (event.target !== canvas) {
    event.target.classList.toggle('selected');
  }
});

document.getElementById('delete-selected').addEventListener('click', () => {
  const selectedElements = document.querySelectorAll('.selected');
  selectedElements.forEach(element => element.remove());
});

canvas.addEventListener('dragend', (event) => {
  const element = event.target;
  if (element !== canvas) {
    const gridSize = 20; // Размер ячейки сетки
    const rect = element.getBoundingClientRect();
    element.style.left = `${Math.round(rect.left / gridSize) * gridSize}px`;
    element.style.top = `${Math.round(rect.top / gridSize) * gridSize}px`;
  }
});

function saveStateToLocalStorage() {
  localStorage.setItem('canvasContent', canvas.innerHTML);
}
canvas.addEventListener('DOMSubtreeModified', saveStateToLocalStorage);

window.addEventListener('load', () => {
  const savedContent = localStorage.getItem('canvasContent');
  if (savedContent) {
    canvas.innerHTML = savedContent;
  }
});
