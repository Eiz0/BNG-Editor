const canvas = document.getElementById('canvas');
const imageUploadInput = document.getElementById('image-upload');

// Сохранение содержимого canvas в localStorage
function saveCanvasToLocalStorage() {
  const canvasContent = canvas.innerHTML;
  localStorage.setItem('canvasContent', canvasContent);
  console.log('Сохраняю в localStorage:', canvasContent);
}

// Загрузка содержимого canvas из localStorage
function loadCanvasFromLocalStorage() {
  const savedContent = localStorage.getItem('canvasContent');
  if (savedContent) {
    canvas.innerHTML = savedContent;
    // Восстанавливаем функциональность для всех элементов
    const allElements = canvas.querySelectorAll('*');
    allElements.forEach((el) => {
      el.addEventListener('click', () => el.classList.toggle('selected'));
    });
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
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .editor-canvas { 
      background-color: #f0f0f0; 
      position: relative; 
      width: 100%; 
      height: 100vh; 
      border: 1px solid #ccc; 
    }
    .editor-canvas > * { 
      position: absolute; 
      cursor: grab; 
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
        ${content}
      </div>
    </body>
    </html>
  `;

  // Создаем Blob для загрузки
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

document.getElementById('reset-position').addEventListener('click', () => {
  const elements = canvas.children;
  for (let element of elements) {
    element.style.left = '';
    element.style.top = '';
  }
  saveCanvasToLocalStorage(); // Сохраняем сброшенное состояние
  console.log('Положение элементов сброшено');
});

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked;
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Сохраняем настройку
});

// Восстановление темы при загрузке страницы
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
  themeToggle.checked = savedTheme === 'dark';
});

const canvasWidthInput = document.getElementById('canvas-width');
const canvasHeightInput = document.getElementById('canvas-height');
const applyCanvasSizeButton = document.getElementById('apply-canvas-size');

applyCanvasSizeButton.addEventListener('click', () => {
  const width = canvasWidthInput.value || 800;
  const height = canvasHeightInput.value || 600;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  saveCanvasToLocalStorage(); // Сохраняем размер в localStorage
});

// Восстановление размера canvas при загрузке страницы
window.addEventListener('load', () => {
  const savedCanvasWidth = localStorage.getItem('canvasWidth');
  const savedCanvasHeight = localStorage.getItem('canvasHeight');
  if (savedCanvasWidth && savedCanvasHeight) {
    canvas.style.width = `${savedCanvasWidth}px`;
    canvas.style.height = `${savedCanvasHeight}px`;
    canvasWidthInput.value = savedCanvasWidth;
    canvasHeightInput.value = savedCanvasHeight;
  }
});

const projectList = document.getElementById('project-list');
const deleteProjectButton = document.getElementById('delete-project');

// Обновление списка проектов
async function updateProjectList() {
  const response = await fetch('http://localhost:3000/api/projects');
  const projects = await response.json();
  projectList.innerHTML = '';
  projects.forEach(project => {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    projectList.appendChild(option);
  });
}

// Удаление выбранного проекта
deleteProjectButton.addEventListener('click', async () => {
  const projectId = projectList.value;
  if (!projectId) {
    alert('Выберите проект для удаления');
    return;
  }

  const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    alert('Проект удален');
    updateProjectList();
  } else {
    alert('Ошибка при удалении проекта');
  }
});

// Восстановление списка проектов при загрузке
window.addEventListener('load', updateProjectList);

document.getElementById('group-elements').addEventListener('click', () => {
  const selectedElements = Array.from(document.querySelectorAll('.selected'));
  
  if (selectedElements.length < 2) {
    alert('Выберите как минимум два элемента для группировки');
    return;
  }

  // Создаем контейнер группы
  const groupContainer = document.createElement('div');
  groupContainer.classList.add('group');
  groupContainer.style.position = 'absolute';
  groupContainer.style.border = '1px dashed blue'; // Визуальная индикация группы

  // Вычисляем границы группы
  const canvasRect = canvas.getBoundingClientRect();
  let minLeft = Infinity, minTop = Infinity;
  let maxRight = -Infinity, maxBottom = -Infinity;

  selectedElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const offsetX = rect.left - canvasRect.left;
    const offsetY = rect.top - canvasRect.top;

    // Вычисляем общие границы группы
    minLeft = Math.min(minLeft, offsetX);
    minTop = Math.min(minTop, offsetY);
    maxRight = Math.max(maxRight, offsetX + rect.width);
    maxBottom = Math.max(maxBottom, offsetY + rect.height);

    // Перемещаем элемент в группу
    el.style.position = 'absolute';
    el.style.left = `${offsetX - minLeft}px`;
    el.style.top = `${offsetY - minTop}px`;
    el.classList.remove('selected');
    groupContainer.appendChild(el);
  });

  // Устанавливаем размеры и положение группы
  groupContainer.style.left = `${minLeft}px`;
  groupContainer.style.top = `${minTop}px`;
  groupContainer.style.width = `${maxRight - minLeft}px`;
  groupContainer.style.height = `${maxBottom - minTop}px`;

  canvas.appendChild(groupContainer);
  saveCanvasToLocalStorage(); // Сохраняем новое состояние
});


document.getElementById('ungroup-elements').addEventListener('click', () => {
  const selectedGroups = document.querySelectorAll('.group.selected');

  if (selectedGroups.length === 0) {
    alert('Выберите группу для разгруппировки');
    return;
  }

  selectedGroups.forEach((group) => {
    const groupRect = group.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Перемещаем элементы из группы обратно в canvas
    Array.from(group.children).forEach((child) => {
      const childRect = child.getBoundingClientRect();
      const offsetX = childRect.left - groupRect.left + parseFloat(group.style.left || 0);
      const offsetY = childRect.top - groupRect.top + parseFloat(group.style.top || 0);

      child.style.left = `${offsetX}px`;
      child.style.top = `${offsetY}px`;
      canvas.appendChild(child);
    });

    group.remove(); // Удаляем пустую группу
  });

  saveCanvasToLocalStorage(); // Сохраняем новое состояние
});

const elementWidthInput = document.getElementById('element-width');
const elementHeightInput = document.getElementById('element-height');
const applyDimensionsButton = document.getElementById('apply-dimensions');

let selectedElement = null;

// Обновляем текущий элемент при клике
canvas.addEventListener('click', (event) => {
  if (event.target !== canvas) {
    selectedElement = event.target;
    elementWidthInput.value = parseInt(selectedElement.style.width || selectedElement.offsetWidth, 10);
    elementHeightInput.value = parseInt(selectedElement.style.height || selectedElement.offsetHeight, 10);
  }
});

// Применение размеров к выбранному элементу
applyDimensionsButton.addEventListener('click', () => {
  if (!selectedElement) {
    alert('Выберите элемент для изменения размеров');
    return;
  }

  const newWidth = elementWidthInput.value || selectedElement.offsetWidth;
  const newHeight = elementHeightInput.value || selectedElement.offsetHeight;

  selectedElement.style.width = `${newWidth}px`;
  selectedElement.style.height = `${newHeight}px`;

  saveCanvasToLocalStorage(); // Сохраняем изменения
});

const elementRotationInput = document.getElementById('element-rotation');
const applyRotationButton = document.getElementById('apply-rotation');

// Применение вращения к выбранному элементу
applyRotationButton.addEventListener('click', () => {
  if (!selectedElement) {
    alert('Выберите элемент для вращения');
    return;
  }

  const rotation = elementRotationInput.value || 0;
  selectedElement.style.transform = `rotate(${rotation}deg)`;

  saveCanvasToLocalStorage(); // Сохраняем изменения
});
