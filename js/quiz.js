/* =========================================================
   ARTICLE TOOLBAR
   ========================================================= */

const toolbar = document.createElement("div");
toolbar.id = "articleToolbar";

toolbar.innerHTML = `
    <button id="articleHome">☰</button>
    <button id="articleZoomOut">A−</button>
    <button id="articleZoomIn">A+</button>
    <button id="articleYomitan">📖 Yomitan</button>
`;

document.body.insertBefore(toolbar, document.body.firstChild);


/* =========================================================
   ZOOM
   ========================================================= */

let zoom = parseFloat(localStorage.getItem("articleZoom")) || 1;

function applyZoom() {
    document.documentElement.style.fontSize = `${zoom}em`;
}

document.getElementById("articleZoomIn").addEventListener("click", () => {
    zoom = Math.min(3, zoom + 0.1);
    localStorage.setItem("articleZoom", zoom);
    applyZoom();
});

document.getElementById("articleZoomOut").addEventListener("click", () => {
    zoom = Math.max(0.5, zoom - 0.1);
    localStorage.setItem("articleZoom", zoom);
    applyZoom();
});


/* =========================================================
   KEYBOARD ZOOM
   Ctrl + Arrow Up / Down
   ========================================================= */

document.addEventListener("keydown", event => {

    if (!event.ctrlKey) return;

    if (event.key === "ArrowUp") {
        event.preventDefault();

        zoom = Math.min(3, zoom + 0.1);
        localStorage.setItem("articleZoom", zoom);
        applyZoom();
    }

    if (event.key === "ArrowDown") {
        event.preventDefault();

        zoom = Math.max(0.5, zoom - 0.1);
        localStorage.setItem("articleZoom", zoom);
        applyZoom();
    }
});


/* =========================================================
   HOME
   ========================================================= */

document.getElementById("articleHome").addEventListener("click", () => {
    window.location.href = "../index.html";
});


/* =========================================================
   YOMITAN
   ========================================================= */

document.getElementById("articleYomitan").addEventListener("click", () => {
    window.open(
        "https://yomitan.wiki/",
        "_blank",
        "noopener,noreferrer"
    );
});


/* =========================================================
   INITIAL ZOOM
   ========================================================= */

applyZoom();


/* =========================================================
   QUIZ
   ========================================================= */

const quiz = document.querySelector(".reading-quiz");

if (quiz) {

    const button = quiz.querySelector("#checkAnswers");
    const results = quiz.querySelector("#quizResults");

    const questions = Array.from(
        quiz.querySelectorAll(".question")
    );


    /* -----------------------------------------------------
       HIGHLIGHT SELECTED ANSWER
       ----------------------------------------------------- */

    quiz.querySelectorAll('input[type="radio"]').forEach(input => {

        input.addEventListener("change", () => {

            const question = input.closest(".question");

            question.querySelectorAll("label").forEach(label => {

                label.classList.remove(
                    "quiz-selected",
                    "quiz-correct",
                    "quiz-incorrect"
                );

            });

            input.closest("label")
                .classList.add("quiz-selected");
        });

    });


    /* -----------------------------------------------------
       CHECK ANSWERS
       ----------------------------------------------------- */

    button.addEventListener("click", () => {

        let score = 0;

        questions.forEach(question => {

            const selected = question.querySelector(
                'input[type="radio"]:checked'
            );

            question.querySelectorAll("label").forEach(label => {

                label.classList.remove(
                    "quiz-selected",
                    "quiz-correct",
                    "quiz-incorrect"
                );

            });

            if (!selected) return;

            const correctAnswer = question.dataset.answer;

            if (selected.value === correctAnswer) {

                score++;

                selected
                    .closest("label")
                    .classList.add("quiz-correct");

            } else {

                selected
                    .closest("label")
                    .classList.add("quiz-incorrect");

                const correctInput = question.querySelector(
                    `input[value="${correctAnswer}"]`
                );

                if (correctInput) {

                    correctInput
                        .closest("label")
                        .classList.add("quiz-correct");

                }

            }

        });

        results.textContent =
            `得点：${score} / ${questions.length}`;

        results.style.display = "block";
    });


    /* =====================================================
       QUESTION MODAL
       ===================================================== */

    let currentQuestion = 0;
    let savedScrollPosition = 0;


    /* -----------------------------------------------------
       CREATE MODAL
       ----------------------------------------------------- */

    const modal = document.createElement("div");

    modal.id = "questionModal";

    modal.innerHTML = `
        <div class="question-modal-content">

            <button
                type="button"
                id="closeQuestionModal"
                class="question-modal-close"
            >×</button>

            <div class="question-modal-header">
                <span id="questionCounter"></span>
            </div>

            <div id="modalQuestion"></div>

            <div class="question-modal-navigation">

                <button
                    type="button"
                    id="previousQuestion"
                >
                    ← 前へ
                </button>

                <button
                    type="button"
                    id="nextQuestion"
                >
                    次へ →
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    /* -----------------------------------------------------
       OPEN BUTTON
       ----------------------------------------------------- */

    const openButton = document.createElement("button");

    openButton.id = "openQuestionModal";
    openButton.type = "button";
    openButton.textContent = "問題";

    document.body.appendChild(openButton);


    /* -----------------------------------------------------
       ELEMENTS
       ----------------------------------------------------- */

    const modalQuestion =
        document.getElementById("modalQuestion");

    const questionCounter =
        document.getElementById("questionCounter");

    const closeButton =
        document.getElementById("closeQuestionModal");

    const previousButton =
        document.getElementById("previousQuestion");

    const nextButton =
        document.getElementById("nextQuestion");

    const modalContent =
        document.querySelector(".question-modal-content");

    const modalHeader =
        document.querySelector(".question-modal-header");


    /* =====================================================
       SHOW QUESTION
       ===================================================== */

    function showQuestion() {

        const original = questions[currentQuestion];

        modalQuestion.innerHTML =
            original.outerHTML;


        /* -------------------------------------------------
           Give modal radios their own group
           ------------------------------------------------- */

        modalQuestion
            .querySelectorAll('input[type="radio"]')
            .forEach(input => {
                input.name = "modalQuestion";
            });


        /* -------------------------------------------------
           Copy selected answer
           ------------------------------------------------- */

        const originalSelected =
            original.querySelector(
                'input[type="radio"]:checked'
            );

        if (originalSelected) {

            const modalSelected =
                modalQuestion.querySelector(
                    `input[value="${originalSelected.value}"]`
                );

            if (modalSelected) {
                modalSelected.checked = true;
            }
        }


        /* -------------------------------------------------
           Copy answer highlighting
           ------------------------------------------------- */

        const realLabels =
            original.querySelectorAll("label");

        const modalLabels =
            modalQuestion.querySelectorAll("label");

        modalLabels.forEach((label, index) => {

            if (!realLabels[index]) return;

            if (
                realLabels[index].classList.contains(
                    "quiz-selected"
                )
            ) {
                label.classList.add("quiz-selected");
            }

            if (
                realLabels[index].classList.contains(
                    "quiz-correct"
                )
            ) {
                label.classList.add("quiz-correct");
            }

            if (
                realLabels[index].classList.contains(
                    "quiz-incorrect"
                )
            ) {
                label.classList.add("quiz-incorrect");
            }

        });


        /* -------------------------------------------------
           Synchronize modal answer with real quiz
           ------------------------------------------------- */

        modalQuestion
            .querySelectorAll('input[type="radio"]')
            .forEach(input => {

                input.addEventListener("change", () => {

                    const realInput =
                        original.querySelector(
                            `input[value="${input.value}"]`
                        );

                    if (!realInput) return;

                    realInput.checked = true;


                    original
                        .querySelectorAll("label")
                        .forEach(label => {

                            label.classList.remove(
                                "quiz-selected",
                                "quiz-correct",
                                "quiz-incorrect"
                            );

                        });


                    realInput
                        .closest("label")
                        .classList.add("quiz-selected");


                    modalQuestion
                        .querySelectorAll("label")
                        .forEach(label => {

                            label.classList.remove(
                                "quiz-selected",
                                "quiz-correct",
                                "quiz-incorrect"
                            );

                        });


                    input
                        .closest("label")
                        .classList.add("quiz-selected");

                });

            });


        /* -------------------------------------------------
           Counter and navigation
           ------------------------------------------------- */

        questionCounter.textContent =
            `${currentQuestion + 1} / ${questions.length}`;

        previousButton.disabled =
            currentQuestion === 0;

        nextButton.disabled =
            currentQuestion === questions.length - 1;
    }


    /* =====================================================
       OPEN
       ===================================================== */

    openButton.addEventListener("click", () => {

        savedScrollPosition = window.scrollY;

        currentQuestion = 0;

        showQuestion();

        modal.classList.add(
            "question-modal-open"
        );
    });


    /* =====================================================
       CLOSE
       ===================================================== */

    function closeQuestionModal() {

        modal.classList.remove(
            "question-modal-open"
        );

        window.scrollTo(
            0,
            savedScrollPosition
        );
    }


    closeButton.addEventListener(
        "click",
        closeQuestionModal
    );


    /* =====================================================
       PREVIOUS
       ===================================================== */

    previousButton.addEventListener("click", () => {

        if (currentQuestion <= 0) return;

        currentQuestion--;

        showQuestion();
    });


    /* =====================================================
       NEXT
       ===================================================== */

    nextButton.addEventListener("click", () => {

        if (
            currentQuestion >=
            questions.length - 1
        ) {
            return;
        }

        currentQuestion++;

        showQuestion();
    });


    /* =====================================================
       CLICK OUTSIDE
       ===================================================== */

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeQuestionModal();
        }

    });


    /* =====================================================
       ESCAPE + ARROW KEYS
       ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            !modal.classList.contains(
                "question-modal-open"
            )
        ) {
            return;
        }

        if (event.key === "Escape") {

            closeQuestionModal();

            return;
        }

        if (
            event.key === "ArrowLeft" &&
            currentQuestion > 0
        ) {

            currentQuestion--;

            showQuestion();
        }

        if (
            event.key === "ArrowRight" &&
            currentQuestion <
                questions.length - 1
        ) {

            currentQuestion++;

            showQuestion();
        }

    });


    /* =====================================================
       DRAG MODAL
       Desktop only
       ===================================================== */

    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;


    modalHeader.addEventListener("mousedown", event => {

        if (window.innerWidth <= 768) return;

        dragging = true;

        const rect =
            modalContent.getBoundingClientRect();

        dragOffsetX =
            event.clientX - rect.left;

        dragOffsetY =
            event.clientY - rect.top;


        modalContent.style.right = "auto";
        modalContent.style.bottom = "auto";

        modalContent.style.left =
            `${rect.left}px`;

        modalContent.style.top =
            `${rect.top}px`;

        event.preventDefault();
    });


    document.addEventListener("mousemove", event => {

        if (!dragging) return;

        let left =
            event.clientX - dragOffsetX;

        let top =
            event.clientY - dragOffsetY;


        const maxLeft =
            window.innerWidth -
            modalContent.offsetWidth;

        const maxTop =
            window.innerHeight -
            modalContent.offsetHeight;


        left =
            Math.max(
                0,
                Math.min(left, maxLeft)
            );

        top =
            Math.max(
                0,
                Math.min(top, maxTop)
            );


        modalContent.style.left =
            `${left}px`;

        modalContent.style.top =
            `${top}px`;
    });


    document.addEventListener("mouseup", () => {

        dragging = false;

    });

}