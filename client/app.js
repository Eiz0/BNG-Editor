document.getElementById("add-button").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const button = document.createElement("button");
    button.textContent = "Кнопка";
    button.style.margin = "10px";
    canvas.appendChild(button);
  });
  
  document.getElementById("add-text").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const text = document.createElement("p");
    text.textContent = "Текст";
    text.style.margin = "10px";
    canvas.appendChild(text);
  });  