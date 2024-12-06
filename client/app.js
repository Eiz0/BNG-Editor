const canvas = document.getElementById('canvas');
const imageUploadInput = document.getElementById('image-upload');

// Сохранение содержимого canvas в localStorage
function saveCanvasToLocalStorage() {
  const content = canvas.innerHTML;
  console.log('Сохраняю в localStorage:', content); // Лог для проверки
  localStorage.setItem('canvasContent', content);
}

// Загрузка содержимого canvas из localStorage
function loadCanvasFromLocalStorage() {
  const savedContent = localStorage.getItem('canvasContent');
  console.log('Загружаю из localStorage:', savedContent); // Лог для проверки
  if (savedContent) {
    canvas.innerHTML = savedContent;
  }
}

// Пример функции с вызовом saveCanvasToLocalStorage
document.getElementById('add-button').addEventListener('click', () => {
  const button = document.createElement('button');
  button.textContent = 'Кнопка';
  button.style.margin = '10px';
  canvas.appendChild(button);
  saveCanvasToLocalStorage();
});

document.getElementById('add-text').addEventListener('click', () => {
  const text = document.createElement('p');
  text.textContent = 'Текст';
  text.style.margin = '10px';
  canvas.appendChild(text);
  saveCanvasToLocalStorage();
});

document.getElementById('add-text-input').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Введите текст...';
  input.style.margin = '10px';
  canvas.appendChild(input);
  saveCanvasToLocalStorage();
});

document.getElementById('add-image').addEventListener('click', () => {
  imageUploadInput.click();
});

imageUploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.margin = '10px';
      img.style.width = '100px';
      img.style.height = '100px';
      canvas.appendChild(img);
      saveCanvasToLocalStorage();
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('delete-selected').addEventListener('click', () => {
  const selectedElements = document.querySelectorAll('.selected');
  selectedElements.forEach(element => element.remove());
  saveCanvasToLocalStorage();
});

canvas.addEventListener('click', (event) => {
  if (event.target !== canvas) {
    event.target.classList.toggle('selected');
  }
});

document.getElementById('export-project').addEventListener('click', () => {
  const content = canvas.innerHTML;
  const styles = `
    body { font-family: Arial, sans-serif; }
    .editor-canvas { background-color: #f0f0f0; padding: 10px; }
    button { margin: 10px; padding: 10px; }
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
      <div class="editor-canvas">${content}</div>
    </body>
    </html>
  `;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'exported_project.html';
  link.click();
});

async function saveProject() {
  const content = canvas.innerHTML;
  const name = prompt('Введите имя проекта:');
  if (!name) {
    alert('Имя проекта обязательно!');
    return;
  }
  const response = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content }),
  });
  const result = await response.json();
  alert(result.message);
}

async function loadProjects() {
  const response = await fetch('http://localhost:3000/api/projects');
  const projects = await response.json();
  canvas.innerHTML = '';
  projects.forEach(project => {
    const container = document.createElement('div');
    container.innerHTML = `<strong>${project.name}:</strong>${project.content}`;
    canvas.appendChild(container);
  });
}

document.getElementById('save-project').addEventListener('click', saveProject);
document.getElementById('load-projects').addEventListener('click', loadProjects);

const fontSizeInput = document.getElementById('font-size');
const textColorInput = document.getElementById('text-color');
canvas.addEventListener('click', (event) => {
  if (event.target !== canvas) {
    const selectedElement = event.target;
    fontSizeInput.value = parseInt(window.getComputedStyle(selectedElement).fontSize, 10) || 16;
    textColorInput.value = window.getComputedStyle(selectedElement).color || '#000000';
    fontSizeInput.addEventListener('input', () => {
      selectedElement.style.fontSize = `${fontSizeInput.value}px`;
    });
    textColorInput.addEventListener('input', () => {
      selectedElement.style.color = textColorInput.value;
    });
  }
});

window.addEventListener('load', loadCanvasFromLocalStorage);

document.getElementById('clear-canvas').addEventListener('click', () => {
  canvas.innerHTML = ''; // Очистка содержимого canvas
  localStorage.removeItem('canvasContent'); // Удаление содержимого из localStorage
  console.log('Canvas очищен и данные удалены из localStorage');
});

let draggedElement = null; // Элемент, который перетаскивается
let offsetX = 0; // Смещение по X
let offsetY = 0; // Смещение по Y

// Обработчик начала перетаскивания
canvas.addEventListener('mousedown', (event) => {
  if (event.target !== canvas) {
    draggedElement = event.target;
    draggedElement.classList.add('dragging');

    // Запоминаем начальное смещение курсора
    const rect = draggedElement.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
});

// Перемещение элемента
function onMouseMove(event) {
  if (draggedElement) {
    draggedElement.style.left = `${event.clientX - offsetX}px`;
    draggedElement.style.top = `${event.clientY - offsetY}px`;
  }
}

// Завершение перетаскивания
function onMouseUp() {
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
    draggedElement = null;
    saveCanvasToLocalStorage(); // Сохраняем новое положение в localStorage
  }

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

function onMouseMove(event) {
  if (draggedElement) {
    const canvasRect = canvas.getBoundingClientRect();
    const newLeft = event.clientX - offsetX;
    const newTop = event.clientY - offsetY;

    // Ограничиваем перемещение
    if (newLeft >= 0 && newLeft + draggedElement.offsetWidth <= canvasRect.width) {
      draggedElement.style.left = `${newLeft}px`;
    }
    if (newTop >= 0 && newTop + draggedElement.offsetHeight <= canvasRect.height) {
      draggedElement.style.top = `${newTop}px`;
    }
  }
}
