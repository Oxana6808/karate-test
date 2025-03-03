let currentLang = "ru";
let currentWordIndex = 0;
let mistakes = [];
let correctAnswers = 0;
let shuffledWords = [];
let selectedOption = null;
let isIncorrectSelected = false; // Новый флаг для отслеживания неверного выбора

const startTestBtn = document.getElementById("start-test");
const testContainer = document.querySelector(".test-container");
const questionWord = document.getElementById("question-word");
const transcription = document.getElementById("transcription");
const imageContainer = document.getElementById("image-container");
const optionsDiv = document.getElementById("options");
const progress = document.getElementById("progress");
const stopBtn = document.getElementById("stop-test");
const dontKnowBtn = document.getElementById("dont-know");
const nextBtn = document.getElementById("next-question");
const restartBtn = document.getElementById("back-to-start");
const resultsDiv = document.querySelector(".results");
const scoreDisplay = document.getElementById("score");
const mistakesTableBody = document.querySelector("#mistakes-table tbody");
const title = document.getElementById("title"); // Новый элемент для заголовка

// Переключение языка
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".lang-btn.active").classList.remove("active");
        btn.classList.add("active");
        currentLang = btn.dataset.lang;
        updateLanguageButtons(); // Обновляем цвета кнопок языка
        updateButtonText(); // Обновляем текст кнопок при смене языка
        updateTitle(); // Обновляем текст заголовка
        if (testContainer.style.display === "block") loadQuestion();
    });
});

// Обновление текста заголовка
function updateTitle() {
    title.textContent = currentLang === "ru" ? "Изучение слов по карате" : "კარატის სიტყვების შესწავლა";
}

// Обновление цветов кнопок языка
function updateLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.remove("btn-secondary");
            btn.classList.add("btn-success");
        } else {
            btn.classList.remove("btn-success");
            btn.classList.add("btn-secondary");
        }
    });
}

// Обновление текста кнопок
function updateButtonText() {
    stopBtn.textContent = stopBtn.getAttribute(`data-text-${currentLang}`);
    dontKnowBtn.textContent = dontKnowBtn.getAttribute(`data-text-${currentLang}`);
    nextBtn.textContent = nextBtn.getAttribute(`data-text-${currentLang}`);
}

// Начало теста
startTestBtn.addEventListener("click", () => {
    shuffledWords = [...words].sort(() => Math.random() - 0.5);
    currentWordIndex = 0;
    correctAnswers = 0;
    mistakes = [];
    selectedOption = null;
    isIncorrectSelected = false;
    testContainer.style.display = "block";
    startTestBtn.style.display = "none";
    resultsDiv.style.display = "none";
    loadQuestion();
    nextBtn.style.display = "none";
    dontKnowBtn.style.display = "block";
    updateLanguageButtons(); // Убедимся, что цвета кнопок языка соответствуют текущему языку
    updateButtonText(); // Убедимся, что текст кнопок соответствует языку
    updateTitle(); // Устанавливаем начальный текст заголовка
});

// Загрузка вопроса
function loadQuestion() {
    const word = shuffledWords[currentWordIndex];
    questionWord.textContent = word.japanese;
    transcription.textContent = word.transcription[currentLang];
    progress.textContent = `${currentWordIndex + 1} / ${shuffledWords.length}`;

    // Отображение картинки (если есть)
    imageContainer.innerHTML = word.image ? `<img src="${word.image}" alt="${word.japanese}" class="img-fluid">` : "";

    const options = generateOptions(word);
    optionsDiv.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.classList.add("btn", "btn-outline-secondary", "w-100", "mb-2", "d-block", "mx-auto");
        btn.addEventListener("click", () => selectOption(opt, word));
        optionsDiv.appendChild(btn);
    });
    nextBtn.style.display = "none";
    dontKnowBtn.style.display = "block";
    stopBtn.style.display = "block";
    selectedOption = null;
    isIncorrectSelected = false; // Сброс флага при загрузке нового вопроса
    resetOptionColors(); // Сбрасываем цвета только при новом вопросе
    updateLanguageButtons(); // Обновляем цвета кнопок языка для текущего вопроса
    updateButtonText(); // Обновляем текст кнопок для текущего языка
    updateTitle(); // Обновляем текст заголовка для текущего языка
}

// Генерация вариантов ответа
function generateOptions(correctWord) {
    const options = [correctWord.translation[currentLang]];
    while (options.length < 5) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const translation = randomWord.translation[currentLang];
        if (!options.includes(translation)) options.push(translation);
    }
    return options.sort(() => Math.random() - 0.5);
}

// Выбор варианта
function selectOption(selected, correctWord) {
    selectedOption = selected;
    const isCorrect = selected === correctWord.translation[currentLang];
    resetOptionColors(); // Сбрасываем цвета перед обновлением
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.textContent === selected) {
            if (isCorrect) {
                btn.classList.remove("btn-outline-secondary");
                btn.classList.add("btn-success");
            } else {
                btn.classList.remove("btn-outline-secondary");
                btn.classList.add("btn-danger");
                isIncorrectSelected = true; // Устанавливаем флаг, если выбор неверный
            }
        }
    });
    dontKnowBtn.style.display = "none";
    nextBtn.style.display = "block";
    stopBtn.style.display = "block";

    // Если выбор сделан, сразу проверяем и сохраняем результат
    if (isCorrect) {
        correctAnswers++;
    } else if (isIncorrectSelected) {
        mistakes.push({
            word: correctWord.japanese,
            transcription: correctWord.transcription[currentLang],
            correct: correctWord.translation[currentLang]
        });
    }
    updateLanguageButtons(); // Обновляем цвета кнопок языка после выбора
    updateButtonText(); // Обновляем текст кнопок после выбора
    updateTitle(); // Обновляем текст заголовка после выбора
}

// Сброс цветов кнопок (только при новом вопросе или сбросе)
function resetOptionColors() {
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.classList.remove("btn-success", "btn-danger");
        btn.classList.add("btn-outline-secondary");
    });
}

// Кнопка "Далее"
nextBtn.addEventListener("click", () => {
    if (selectedOption || isIncorrectSelected) { // Добавляем проверку isIncorrectSelected
        currentWordIndex++;
        if (currentWordIndex < shuffledWords.length) {
            loadQuestion(); // Это сбросит цвета и флаг
        } else {
            showResults();
        }
    }
    updateLanguageButtons(); // Обновляем цвета кнопок языка после перехода
    updateButtonText(); // Обновляем текст кнопок после перехода
    updateTitle(); // Обновляем текст заголовка после перехода
});

// Кнопка "Не знаю"
dontKnowBtn.addEventListener("click", () => {
    const word = shuffledWords[currentWordIndex];
    mistakes.push({
        word: word.japanese,
        transcription: word.transcription[currentLang],
        correct: word.translation[currentLang]
    });
    resetOptionColors();
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.textContent === word.translation[currentLang]) {
            btn.classList.remove("btn-outline-secondary");
            btn.classList.add("btn-success");
        }
    });
    dontKnowBtn.style.display = "none";
    nextBtn.style.display = "block"; // Убеждаемся, что кнопка "Далее" видна
    stopBtn.style.display = "block";
    isIncorrectSelected = true; // Устанавливаем флаг, чтобы кнопка "Далее" работала
    selectedOption = word.translation[currentLang]; // Устанавливаем выбранный вариант как правильный
    updateLanguageButtons(); // Обновляем цвета кнопок языка после выбора
    updateButtonText(); // Обновляем текст кнопок после выбора
    updateTitle(); // Обновляем текст заголовка после выбора
});

// Кнопка "Стоп"
stopBtn.addEventListener("click", () => {
    testContainer.style.display = "none";
    resultsDiv.style.display = "none";
    startTestBtn.style.display = "block";
    selectedOption = null;
    isIncorrectSelected = false;
    updateLanguageButtons(); // Обновляем цвета кнопок языка после остановки
    updateButtonText(); // Обновляем текст кнопок после остановки
    updateTitle(); // Обновляем текст заголовка после остановки
});

// Показ результатов
function showResults() {
    testContainer.style.display = "none";
    resultsDiv.style.display = "block";
    scoreDisplay.textContent = `Правильно: ${correctAnswers}, Ошибок: ${mistakes.length}`;
    if (currentLang === "ge") scoreDisplay.textContent = `სწორი: ${correctAnswers}, შეცდომები: ${mistakes.length}`;
    mistakesTableBody.innerHTML = "";
    mistakes.forEach(m => {
        const row = document.createElement("tr");
        row.innerHTML = `<td class="text-center">${m.word}</td><td class="text-center">${m.transcription}</td><td class="text-center">${m.correct}</td>`;
        mistakesTableBody.appendChild(row);
    });
    updateLanguageButtons(); // Обновляем цвета кнопок языка для результатов
    updateButtonText(); // Обновляем текст кнопок для результатов
    updateTitle(); // Обновляем текст заголовка для результатов
}

// Вернуться на начало
restartBtn.addEventListener("click", () => {
    resultsDiv.style.display = "none";
    startTestBtn.style.display = "block";
    testContainer.style.display = "none";
    selectedOption = null;
    isIncorrectSelected = false;
    updateLanguageButtons(); // Обновляем цвета кнопок языка после возврата
    updateButtonText(); // Обновляем текст кнопок после возврата
    updateTitle(); // Обновляем текст заголовка после возврата
});
