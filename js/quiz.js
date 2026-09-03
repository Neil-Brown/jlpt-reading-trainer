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

    // Highlight selected answer
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

            input.closest("label").classList.add("quiz-selected");

        });

    });


    // Check answers
    button.addEventListener("click", () => {

        const questions = quiz.querySelectorAll(".question");

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

            if (!selected) {
                return;
            }

            const correctAnswer = question.dataset.answer;

            if (selected.value === correctAnswer) {

                score++;

                selected.closest("label")
                    .classList.add("quiz-correct");

            } else {

                selected.closest("label")
                    .classList.add("quiz-incorrect");

                const correctInput = question.querySelector(
                    `input[value="${correctAnswer}"]`
                );

                if (correctInput) {
                    correctInput.closest("label")
                        .classList.add("quiz-correct");
                }

            }

        });


        // Show score
        results.textContent =
            `得点：${score} / ${questions.length}`;

        results.style.display = "block";

    });

}