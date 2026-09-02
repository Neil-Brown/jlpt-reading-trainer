const quiz = document.querySelector(".reading-quiz");

if (quiz) {
    
    const button = quiz.querySelector("#checkAnswers");
    const results = quiz.querySelector("#quizResults");

    // Highlight selected answer
    quiz.querySelectorAll('input[type="radio"]').forEach(input => {

        input.addEventListener("change", () => {

            const question = input.closest(".question");

            // Remove previous feedback
            question.querySelectorAll("label").forEach(label => {
                label.classList.remove(
                    "quiz-selected",
                    "quiz-correct",
                    "quiz-incorrect"
                );
            });

            // Highlight selected answer
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

            // Clear previous colours
            question.querySelectorAll("label").forEach(label => {
                label.classList.remove(
                    "quiz-selected",
                    "quiz-correct",
                    "quiz-incorrect"
                );
            });

            // Nothing selected
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

                // Highlight correct answer
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