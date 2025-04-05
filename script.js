let currentLang = "ru";
let currentTheme = null;
let currentWordIndex = 0;
let correctAnswers = 0;
let shuffledWords = [];
let selectedOption = null;
let isIncorrectSelected = false;
let mistakes = new Set(); // Используем Set для уникальных ошибок
let testMode = "word-to-translation"; // По умолчанию "Слово → Перевод"
let currentOptions = []; // Храним текущие варианты ответа
let initialLang = "ru"; // Язык, на котором были сгенерированы варианты ответа

const themeSelection = document.getElementById("theme-selection");
const testContainer = document.querySelector(".test-container");
const translationText = document.getElementById("translation-text");
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
const modeToggle = document.getElementById("mode-toggle");
const wordToTranslationLabel = document.getElementById("word-to-translation");
const translationToWordLabel = document.getElementById("translation-to-word");

// Переключение режима теста
modeToggle.addEventListener("change", () => {
    testMode = modeToggle.checked ? "translation-to-word" : "word-to-translation";
    updateModeLabels();
    if (testContainer.style.display === "block") loadQuestion(); // Обновляем вопрос при переключении режима
});

// Обновление текста переключателя режимов
function updateModeLabels() {
    wordToTranslationLabel.textContent = wordToTranslationLabel.getAttribute(`data-text-${currentLang}`);
    translationToWordLabel.textContent = translationToWordLabel.getAttribute(`data-text-${currentLang}`);
}

// Переключение языка
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".lang-btn.active").classList.remove("active");
        btn.classList.add("active");
        currentLang = btn.dataset.lang;
        updateLanguageButtons();
        updateButtonText();
        updateTitle();
        updateThemeButtonsText();
        updateTableHeaders();
        updateModeLabels();
        if (testContainer.style.display === "block") loadQuestion(false); // Не генерируем новые варианты ответа
        if (resultsDiv.style.display === "block") showResults();
    });
});

// Обновление текста заголовка
function updateTitle() {
    const titles = {
        ru: "Изучение слов по карате🥋",
        ge: "კარატის სიტყვების შესწავლა🥋",
        en: "Learning Karate Words🥋"
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
        mistakes.clear(); // Очищаем Set ошибок
        selectedOption = null;
        isIncorrectSelected = false;
        currentOptions = []; // Очищаем варианты ответа
        initialLang = currentLang; // Сохраняем язык, на котором генерируются варианты
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
function loadQuestion(generateNewOptions = true) {
    if (currentWordIndex >= shuffledWords.length) {
        showResults();
        return;
    }

    const word = shuffledWords[currentWordIndex];
    // Отображение картинки (если есть)
    imageContainer.innerHTML = word.image ? `<img src="${word.image}" alt="${word.japanese}" class="img-fluid">` : "";
    progress.textContent = `${currentWordIndex + 1} / ${shuffledWords.length}`;

    if (testMode === "word-to-translation") {
        // Режим "Слово → Перевод": иероглиф → транскрипция
        translationText.textContent = ""; // Скрываем перевод
        translationText.style.display = "none";
        questionWord.textContent = word.japanese; // Иероглиф
        questionWord.style.display = "block";
        transcription.textContent = word.transcription[currentLang]; // Транскрипция
        transcription.style.display = "block";
    } else {
        // Режим "Перевод → Слово": иероглиф → перевод
        translationText.textContent = word.translation[currentLang]; // Перевод
        translationText.style.display = "block";
        questionWord.textContent = word.japanese; // Иероглиф
        questionWord.style.display = "block";
        transcription.textContent = ""; // Скрываем транскрипцию
        transcription.style.display = "none";
    }

    // Генерируем варианты ответа только если это новый вопрос или режим изменился
    if (generateNewOptions) {
        currentOptions = generateOptions(word);
        initialLang = currentLang; // Сохраняем язык, на котором были сгенерированы варианты
    }

    // Обновляем текст кнопок в зависимости от текущего языка
    optionsDiv.innerHTML = "";
    currentOptions.forEach(opt => {
        const btn = document.createElement("button");
        // Находим слово, соответствующее варианту ответа, и отображаем его на текущем языке
        const optionWord = words.find(w =>
            testMode === "word-to-translation" ?
                w.translation[initialLang] === opt :
                w.transcription[initialLang] === opt
        );
        if (optionWord) {
            btn.textContent = testMode === "word-to-translation" ?
                optionWord.translation[currentLang] :
                optionWord.transcription[currentLang];
        } else {
            btn.textContent = opt; // На случай, если слово не найдено (хотя это не должно происходить)
        }
        btn.classList.add("btn", "btn-outline-secondary", "w-100", "mb-2", "d-block", "mx-auto");
        btn.dataset.originalText = opt; // Сохраняем оригинальный текст для проверки
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
    const options = [];
    if (testMode === "word-to-translation") {
        // В режиме "Слово → Перевод" варианты ответа — переводы
        options.push(correctWord.translation[currentLang]);
        while (options.length < 5) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const translationOption = randomWord.translation[currentLang];
            if (!options.includes(translationOption) && randomWord.theme === correctWord.theme) {
                options.push(translationOption);
            }
        }
    } else {
        // В режиме "Перевод → Слово" варианты ответа — транскрипции
        options.push(correctWord.transcription[currentLang]);
        while (options.length < 5) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            const transcriptionOption = randomWord.transcription[currentLang];
            if (!options.includes(transcriptionOption) && randomWord.theme === correctWord.theme) {
                options.push(transcriptionOption);
            }
        }
    }
    return options.sort(() => Math.random() - 0.5);
}

// Выбор варианта
function selectOption(selected, correctWord) {
    selectedOption = selected;
    const isCorrect = testMode === "word-to-translation" ?
        selected === correctWord.translation[initialLang] :
        selected === correctWord.transcription[initialLang];
    resetOptionColors();
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.dataset.originalText === selected) {
            if (isCorrect) {
                btn.classList.remove("btn-outline-secondary");
                btn.classList.add("btn-success");
                nextBtn.style.display = "block"; // Показываем "Далее" только при верном ответе
                dontKnowBtn.style.display = "none"; // Скрываем "Не знаю" при верном ответе
            } else {
                btn.classList.remove("btn-outline-secondary");
                btn.classList.add("btn-danger");
                isIncorrectSelected = true;
                dontKnowBtn.style.display = "block"; // "Не знаю" остается видимым при ошибке
                nextBtn.style.display = "none"; // "Далее" не показываем при ошибке
                // Добавляем ошибку
                mistakes.add(correctWord.japanese);
            }
        }
    });
    if (isCorrect) {
        correctAnswers++;
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
    if (selectedOption && (selectedOption === (testMode === "word-to-translation" ? shuffledWords[currentWordIndex].translation[initialLang] : shuffledWords[currentWordIndex].transcription[initialLang]) || isIncorrectSelected)) {
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
    // Добавляем ошибку
    mistakes.add(word.japanese);
    resetOptionColors();
    const buttons = optionsDiv.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.dataset.originalText === (testMode === "word-to-translation" ? word.translation[initialLang] : word.transcription[initialLang])) {
            btn.classList.remove("btn-outline-secondary");
            btn.classList.add("btn-success");
        }
    });
    dontKnowBtn.style.display = "none"; // Скрываем "Не знаю"
    nextBtn.style.display = "block"; // Показываем "Далее" вместо "Не знаю"
    stopBtn.style.display = "block";
    isIncorrectSelected = true;
    selectedOption = testMode === "word-to-translation" ? word.translation[initialLang] : word.transcription[initialLang];
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
});

// Кнопка "Стоп"
stopBtn.addEventListener("click", () => {
    testContainer.style.display = "none";
    resultsDiv.style.display = "block";
    themeSelection.style.display = "none";
    showResults(); // Показываем результаты с таблицей ошибок
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
    // Подсчет ошибок: на основе количества уникальных ошибок в mistakes
    const incorrectAnswers = mistakes.size;
    const totalWords = shuffledWords.length;
    correctAnswers = totalWords - incorrectAnswers; // Правильные ответы = общее количество слов - ошибки
    scoreDisplay.textContent = {
        ru: `Правильно: ${correctAnswers}, Ошибок: ${incorrectAnswers}`,
        ge: `სწორი: ${correctAnswers}, შეცდომები: ${incorrectAnswers}`,
        en: `Correct: ${correctAnswers}, Mistakes: ${incorrectAnswers}`
    }[currentLang];
    mistakesTableBody.innerHTML = "";
    const mistakeWords = words.filter(word => mistakes.has(word.japanese));
    mistakeWords.forEach(m => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-center">${m.japanese}</td>
            <td class="text-center">${m.transcription[currentLang]}</td>
            <td class="text-center">${m.translation[currentLang]}</td>
        `;
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
    currentTheme = null;
    currentWordIndex = 0;
    correctAnswers = 0;
    mistakes.clear();
    selectedOption = null;
    isIncorrectSelected = false;
    currentOptions = []; // Очищаем варианты ответа
    initialLang = currentLang;
    updateLanguageButtons();
    updateButtonText();
    updateTitle();
});
