const cols = document.querySelectorAll(".col"); //забирает список необходимых элементов
document.addEventListener("keydown", (event) => {
  //добавляет прослушиватель событий для события "keydown" (нажатия space) на объекте document
  event.preventDefault(); //гарантирует, что стандартная прокрутка страницы не будет происходить при нажатии клавиши "пробел"
  if (event.code.toLowerCase() === "space") {
    setRandomColors();
  }
});
document.addEventListener("click", (event) => {
  //слушатель по клику
  const type = event.target.dataset.type; //извлекает значение атрибута data-type из элемента, на который пользователь кликнул, и сохраняет это значение в переменной type
  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i" //tagName дает нам название в строковом значении название тега по которому кликнули
        ? event.target
        : event.target.children[0]; //1 ребенок внутри кнопки
    node.classList.toggle("fa-unlock"); //classList - это объект, предоставляющий методы для управления классами элемента.
    node.classList.toggle("fa-lock"); //toggle() - это метод объекта classList, который добавляет класс, если его нет, и удаляет класс, если он уже существует.
  } else if (type === "copy") {
    copyToClickBoard(event.target.textContent); //копируем текст цвета из заголовка h2
  }
});

function copyToClickBoard(text) {
  //копирование текста
  //navigator - это объект, предоставляющий информацию о браузере и его функциональности.
  return navigator.clipboard //clipboard - это свойство navigator, предоставляющее доступ к объекту буфера обмена
    .writeText(text) //метод writeText позволяет записать переданный текст (text) в буфер обмена.
    .then(() => {
      alert("Вы скопировали текст");
    })
    .catch((err) => {
      console.error("Не удалось скопировать текст", err);
    });
}

// function generateRandomColor() {
//   //функция будет отдавать код рамдомного выбранного цвета (реализуем через chroma.js)

//   //RGB
//   //ff0000
//   //00ff00
//   //0000ff
//   const hexCode = "0123456789ABCDEF";
//   let color = "";
//   for (let i = 0; i < 6; i++) {
//     color += hexCode[Math.floor(Math.random() * hexCode.length)];
//   }
//   return "#" + color;
// }

function setRandomColors(isInitial) {
  //по умолчанию isInitial будет иметь значение undefined. Единственный раз он будет находится в true , когда мы загружаем страницу
  //генерируем рандомный цвет
  const colors = isInitial ? getColorsFromHash() : [];
  cols.forEach((col, index) => {
    //обращаемся к колонке и итерируем его
    const isLocked = col.querySelector("i").classList.contains("fa-lock"); //ищем тег i, у него есть classList и с помощью contains определяем есть ли у него данный класс
    const text = col.querySelector("h2"); //забираем тект из h2
    const button = col.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent); //если заблокирован,то мы можем его получить текст цвета из text.
      return;
    }

    const color = isInitial //  если это первичная загрузка , тогда мы должны получить значение из массива colors. если нет библиотека chroma.js генерирует рандомного цвета
      ? colors[index]
        ? colors[index] //двойной тернарный. если у colors есть значение мы его забираем, если нет рандомно генерируем
        : chroma.random()
      : chroma.random();
    if (!isInitial) {
      //если не первоначальная загрузка

      colors.push(color); // а если не заблокирован, пушим color
    }

    text.textContent = color; //меняем Text на сгенерированный код
    col.style.background = color;

    setTextColor(text, color); // Изменение Text в зависимости от оттенка
    setTextColor(button, color); //изменение цвета кнопки
  });
  updateColorsHash(colors);
}

function setTextColor(text, color) {
  // функция сравнивает оттенок цвета
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white"; // если luminance >0.5 то Text - black, меньше white
}

function updateColorsHash(colors = []) {
  // получение цвета в хэш
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getColorsFromHash() {
  //получение цвета из url адреса (массив из заранее готовых цветов)
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomColors(true);
