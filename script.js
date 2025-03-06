let currentLang = "ru";
let currentTheme = null; // Для хранения текущей темы
let currentWordIndex = 0;
let mistakes = [];
let correctAnswers = 0;
let shuffledWords = [];
let selectedOption = null;
let isIncorrectSelected = false;

const themeSelection = document.getElementById("theme-selection");
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
const title = document.getElementById("title");
const themesTitle = document.getElementById("themes-title");
const resultsTitle = document.getElementById("results-title");

// Переключение языка
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".lang-btn.active").classList.remove("active");
        btn.classList.add("active");
        currentLang = btn.dataset.lang;
        updateLanguageButtons(); // Обновляем цвета кнопок языка
        updateButtonText(); // Обновляем текст кнопок
        updateTitle(); // Обновляем текст заголовка
        updateThemeButtonsText(); // Обновляем текст кнопок тем
        updateTableHeaders(); // Обновляем заголовки таблицы
        if (testContainer.style.display === "block") loadQuestion();
        if (resultsDiv.style.display === "block") showResults();
    });
});

// Обновление текста заголовка
function updateTitle() {
    const titles = {
        ru: "Изучение слов по карате",
        ge: "კარატის სიტყვების შესწავლა",
        en: "Learning Karate Words"
    };
    title.textContent = titles[currentLang];
    themesTitle.textContent = {
        ru: "Список тем",
        ge: "თემების სია",
        en: "List of Topics"
    }[currentLang];
    resultsTitle.textContent = resultsTitle.getAttribute(`data-text-${currentLang}`);
}

// Обновление заголовков таблицы
function updateTableHeaders() {
    const headers = document.querySelectorAll("#mistakes-table th");
    headers.forEach(header => {
        header.textContent = header.getAttribute(`data-text-${currentLang}`);
    });
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

// Обновление текста кнопок тем
function updateThemeButtonsText() {
    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.textContent = btn.getAttribute(`data-text-${currentLang}`);
    });
}

// Обновление текста кнопок
function updateButtonText() {
    stopBtn.textContent = stopBtn.getAttribute(`data-text-${currentLang}`);
    dontKnowBtn.textContent = dontKnowBtn.getAttribute(`data-text-${currentLang}`);
    nextBtn.textContent = nextBtn.getAttribute(`data-text-${currentLang}`);
    restartBtn.textContent = restartBtn.getAttribute(`data-text-${currentLang}`);
}

// Выбор темы
document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        currentTheme = btn.dataset.theme;
        shuffledWords = currentTheme === "Полный экзамен" ?
            [...words].sort(() => Math.random() - 0.5) :
            [...words].filter(word => word.theme === currentTheme).sort(() => Math.random() - 0.5);
        currentWordIndex = 0;
        correctAnswers = 0;
        mistakes = [];
        selectedOption = null;
        isIncorrectSelected = false;
        testContainer.style.display = "block";
        themeSelection.style.display = "none";
        resultsDiv.style.display = "none";
        loadQuestion();
        nextBtn.style.display = "none";
        dontKnowBtn.style.display = "block";
        updateButtonText();
        updateTitle();
    });
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
    isIncorrectSelected = false;
    resetOptionColors();
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
}

// Генерация вариантов ответа
function generateOptions(correctWord) {
    const options = [correctWord.translation[currentLang]];
    while (options.length < 5) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const translation = randomWord.translation[currentLang];
        if (!options.includes(translation) && randomWord.theme === correctWord.theme) {
            options.push(translation);
        }
    }
    return options.sort(() => Math.random() - 0.5);
}

// Выбор варианта
function selectOption(selected, correctWord) {
    selectedOption = selected;
    const isCorrect = selected === correctWord.translation[currentLang];
    resetOptionColors();
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.textContent === selected) {
            if (isCorrect) {
                btn.classList.remove("btn-outline-secondary");
                btn.classList.add("btn-success");
            } else {
                btn.classList.remove("btn-outline-secondary");
                btn.classList.add("btn-danger");
                isIncorrectSelected = true;
            }
        }
    });
    dontKnowBtn.style.display = "none";
    nextBtn.style.display = "block";
    stopBtn.style.display = "block";

    if (isCorrect) {
        correctAnswers++;
    } else if (isIncorrectSelected) {
        mistakes.push({
            word: correctWord.japanese,
            transcription: correctWord.transcription[currentLang],
            correct: correctWord.translation[currentLang]
        });
    }
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
}

// Сброс цветов кнопок
function resetOptionColors() {
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.classList.remove("btn-success", "btn-danger");
        btn.classList.add("btn-outline-secondary");
    });
}

// Кнопка "Далее"
nextBtn.addEventListener("click", () => {
    if (selectedOption || isIncorrectSelected) {
        currentWordIndex++;
        if (currentWordIndex < shuffledWords.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
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
    nextBtn.style.display = "block";
    stopBtn.style.display = "block";
    isIncorrectSelected = true;
    selectedOption = word.translation[currentLang];
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
});

// Кнопка "Стоп"
stopBtn.addEventListener("click", () => {
    testContainer.style.display = "none";
    resultsDiv.style.display = "none";
    themeSelection.style.display = "block";
    selectedOption = null;
    isIncorrectSelected = false;
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
});

// Показ результатов
function showResults() {
    testContainer.style.display = "none";
    resultsDiv.style.display = "block";
    scoreDisplay.textContent = {
        ru: `Правильно: ${correctAnswers}, Ошибок: ${mistakes.length}`,
        ge: `სწორი: ${correctAnswers}, შეცდომები: ${mistakes.length}`,
        en: `Correct: ${correctAnswers}, Mistakes: ${mistakes.length}`
    }[currentLang];
    mistakesTableBody.innerHTML = "";
    mistakes.forEach(m => {
        const row = document.createElement("tr");
        row.innerHTML = `<td class="text-center">${m.word}</td><td class="text-center">${m.transcription}</td><td class="text-center">${m.correct}</td>`;
        mistakesTableBody.appendChild(row);
    });
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
    updateTableHeaders();
}

// Вернуться на начало
restartBtn.addEventListener("click", () => {
    resultsDiv.style.display = "none";
    themeSelection.style.display = "block";
    testContainer.style.display = "none";
    selectedOption = null;
    isIncorrectSelected = false;
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
});
