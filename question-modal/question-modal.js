let triggerElement = null;
let openButton = null;
let selectedQuestion = 0;
let currentArticleId = null;
let theme = {};
let modalFontScale = 1;

const QuestionModal = (() => {

    let questionSelector = null;
    let modal = null;
    let content = null;

    function init(options = {}) {

        questionSelector = options.questionSelector;
        triggerElement = options.triggerElement;
        theme = options.theme || {};

        if (!questionSelector) {
            console.error(
                "QuestionModal: questionSelector is required."
            );
            return;
        }

        createModal();
    }

    function update() {

        if (!triggerElement) {
            return;
        }

        const element =
            document.querySelector(triggerElement);

        if (element) {
            createOpenButton();
        } else {
            removeOpenButton();
        }
    }

    function createOpenButton() {

        if (openButton) {
            return;
        }

        const element =
            document.querySelector(triggerElement);

        if (!element) {
            return;
        }

        openButton = document.createElement("button");

        openButton.type = "button";
        openButton.className = "question-modal-open";

        openButton.style.setProperty(
            "--question-modal-primary",
            theme.primary || "#333"
        );

        openButton.style.setProperty(
            "--question-modal-primary-hover",
            theme.primaryHover || "#222"
        );

        openButton.textContent = "問題";

        openButton.addEventListener("click", () => {
            if (modal.classList.contains("is-open")) {
                close();
            } else {
                open();
            }
        });

        openButton.addEventListener("contextmenu", (event) => {
            event.preventDefault();

            resetPosition();
        });

        document.body.appendChild(openButton);
    }

    function resetPosition() {
        if (!modal) return;

        const windowElement =
            modal.querySelector(".question-modal-window");

        if (!windowElement) return;

        // Reset position
        windowElement.style.position = "";
        windowElement.style.left = "";
        windowElement.style.top = "";
        windowElement.style.margin = "";

        // Reset font size
        modalFontScale = 1;
        updateFontSize();
    }

    function createModal() {

        modal = document.createElement("div");
        modal.className = "question-modal";

        modal.style.setProperty(
            "--question-modal-primary",
            theme.primary || "#333"
        );

        modal.style.setProperty(
            "--question-modal-primary-hover",
            theme.primaryHover || "#222"
        );

        modal.style.setProperty(
            "--question-modal-background",
            theme.background || "#fff"
        );

        modal.style.setProperty(
            "--question-modal-menu-background",
            theme.menuBackground || "#f7f7f7"
        );

        modal.style.setProperty(
            "--question-modal-border",
            theme.border || "#ddd"
        );

        modal.style.setProperty(
            "--question-modal-text",
            theme.text || "#333"
        );

        modal.style.setProperty(
            "--question-modal-overlay",
            theme.overlay || "rgba(0, 0, 0, 0.6)"
        );

        // User-controlled font scale
        modal.style.setProperty(
            "--question-modal-scale",
            "1"
        );

        modal.style.setProperty(
            "--question-modal-header-font-size",
            "1.1rem"
        );

        modal.innerHTML = `
            <div class="question-modal-window">

                <div class="question-modal-resize-x"></div>
                <div class="question-modal-resize-y"></div>
                <div class="question-modal-resize-xy"></div>

                <div class="question-modal-header">

                    <span>問題</span>

                    <div class="question-modal-controls">
                    <button
                        type="button"
                        class="question-modal-menu-toggle"
                        aria-label="問題番号メニューを閉じる"
                    >
                        −
                    </button>

                        <button
                            type="button"
                            class="question-modal-font-minus"
                            aria-label="文字を小さくする"
                        >
                            A−
                        </button>

                        <span class="question-modal-font-size">
                            100%
                        </span>

                        <button
                            type="button"
                            class="question-modal-font-plus"
                            aria-label="文字を大きくする"
                        >
                            A＋
                        </button>

                        <button
                            type="button"
                            class="question-modal-close"
                            aria-label="問題を閉じる"
                        >
                            ×
                        </button>

                    </div>

                </div>

                <div class="question-modal-content"></div>

            </div>
        `;

        document.body.appendChild(modal);

        content =
            modal.querySelector(
                ".question-modal-content"
            );

        const windowElement =
            modal.querySelector(
                ".question-modal-window"
            );

        /*
         * Font controls
         */

        const fontMinus =
            modal.querySelector(
                ".question-modal-font-minus"
            );

        const fontPlus =
            modal.querySelector(
                ".question-modal-font-plus"
            );
        const menuToggle =
            modal.querySelector(".question-modal-menu-toggle");
                menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
        
            const menu =
                modal.querySelector(".question-modal-menu");
        
            if (!menu) return;
        
            menu.classList.toggle("is-collapsed");
        
            if (menu.classList.contains("is-collapsed")) {
                menuToggle.textContent = "+";
                menuToggle.setAttribute(
                    "aria-label",
                    "問題番号メニューを開く"
                );
            } else {
                menuToggle.textContent = "−";
                menuToggle.setAttribute(
                    "aria-label",
                    "問題番号メニューを閉じる"
                );
            }
        });
        fontMinus.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                modalFontScale = Math.max(
                    0.5,
                    modalFontScale - 0.1
                );

                updateFontSize();
            }
        );

        fontPlus.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                modalFontScale = Math.min(
                    1.5,
                    modalFontScale + 0.1
                );

                updateFontSize();
            }
        );

        /*
         * Close button
         */

        modal
            .querySelector(".question-modal-close")
            .addEventListener(
                "click",
                close
            );

        /*
         * Dragging
         */

        const header =
            modal.querySelector(
                ".question-modal-header"
            );

        let isDragging = false;

        let startX;
        let startY;
        let startLeft;
        let startTop;

        header.addEventListener(
            "mousedown",
            (event) => {

                // Do not drag when using controls
                if (
                    event.target.closest(
                        ".question-modal-controls"
                    )
                ) {
                    return;
                }

                const rect =
                    windowElement.getBoundingClientRect();

                isDragging = true;

                startX = event.clientX;
                startY = event.clientY;

                startLeft = rect.left;
                startTop = rect.top;

                windowElement.style.position =
                    "fixed";

                windowElement.style.left =
                    `${startLeft}px`;

                windowElement.style.top =
                    `${startTop}px`;

                windowElement.style.margin = "0";

                event.preventDefault();
            }
        );

        document.addEventListener(
            "mousemove",
            (event) => {

                if (!isDragging) {
                    return;
                }

                const newLeft =
                    startLeft +
                    (event.clientX - startX);

                const newTop =
                    startTop +
                    (event.clientY - startY);

                windowElement.style.left =
                    `${newLeft}px`;

                windowElement.style.top =
                    `${newTop}px`;
            }
        );

        document.addEventListener(
            "mouseup",
            () => {

                isDragging = false;

            }
        );

        /*
         * Resizing
         */

        let resizeMode = null;

        let resizeStartX;
        let resizeStartY;
        let resizeStartWidth;
        let resizeStartHeight;

        function startResize(event, mode) {

            resizeMode = mode;

            const rect =
                windowElement.getBoundingClientRect();

            resizeStartX = event.clientX;
            resizeStartY = event.clientY;

            resizeStartWidth = rect.width;
            resizeStartHeight = rect.height;

            event.preventDefault();
            event.stopPropagation();
        }

        modal
            .querySelector(
                ".question-modal-resize-x"
            )
            .addEventListener(
                "mousedown",
                (event) => {
                    startResize(event, "x");
                }
            );

        modal
            .querySelector(
                ".question-modal-resize-y"
            )
            .addEventListener(
                "mousedown",
                (event) => {
                    startResize(event, "y");
                }
            );

        modal
            .querySelector(
                ".question-modal-resize-xy"
            )
            .addEventListener(
                "mousedown",
                (event) => {
                    startResize(event, "xy");
                }
            );

        document.addEventListener(
            "mousemove",
            (event) => {

                if (!resizeMode) {
                    return;
                }

                const deltaX =
                    event.clientX - resizeStartX;

                const deltaY =
                    event.clientY - resizeStartY;

                if (
                    resizeMode === "x" ||
                    resizeMode === "xy"
                ) {

                    const newWidth =
                        resizeStartWidth + deltaX;

                    windowElement.style.width =
                        `${newWidth}px`;

                    /*
                     * Recalculate the base font size,
                     * but preserve modalFontScale.
                     */
                    updateFontSize();
                }

                if (
                    resizeMode === "y" ||
                    resizeMode === "xy"
                ) {

                    const newHeight =
                        resizeStartHeight + deltaY;

                    windowElement.style.height =
                        `${newHeight}px`;
                }
            }
        );

        document.addEventListener(
            "mouseup",
            () => {

                resizeMode = null;

            }
        );
    }

    /*
     * Calculate all modal font sizes in one place.
     *
     * Window width determines the base question size.
     * modalFontScale applies the user's A− / A+ adjustment.
     */

    function updateFontSize() {

        if (!modal) {
            return;
        }

        const windowElement =
            modal.querySelector(
                ".question-modal-window"
            );

        if (!windowElement) {
            return;
        }

        const width =
            windowElement.getBoundingClientRect().width;

        const baseFontSize = Math.max(
            0.85,
            Math.min(
                1.25,
                width * 0.0015
            )
        );

        /*
         * Question and answer text
         */

        const questionFontSize =
            baseFontSize * modalFontScale;

        windowElement.style.setProperty(
            "--question-font-size",
            `${questionFontSize}rem`
        );

        /*
         * Header
         */

        windowElement.style.setProperty(
            "--question-modal-header-font-size",
            `${1.1 * modalFontScale}rem`
        );

        /*
         * Question number buttons
         */

        windowElement.style.setProperty(
            "--question-modal-scale",
            modalFontScale
        );

        /*
         * Percentage display
         */

        const fontSizeDisplay =
            modal.querySelector(
                ".question-modal-font-size"
            );

        if (fontSizeDisplay) {

            fontSizeDisplay.textContent =
                `${Math.round(
                    modalFontScale * 100
                )}%`;
        }
    }

function open() {
    if (!modal) {
        console.error(
            "QuestionModal: Call QuestionModal.init() first."
        );
        return;
    }

    const questions =
        Array.from(
            document.querySelectorAll(questionSelector)
        ).filter(
            question =>
                question.style.display !== "none"
        );

    if (!questions.length) return;

    content.replaceChildren();

    const menu = document.createElement("div");
    menu.className = "question-modal-menu";

    questions.forEach((question, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "question-modal-menu-item";
        button.textContent = index + 1;

        button.addEventListener("click", () => {
            selectedQuestion = index;
            displayQuestion(questions, menu);
        });

        menu.appendChild(button);
    });

    content.appendChild(menu);

    const questionArea =
        document.createElement("div");

    questionArea.className =
        "question-modal-question";

    content.appendChild(questionArea);

    modal.classList.add("is-open");

    displayQuestion(questions, menu);
    updateFontSize();
}
    
    function displayQuestion(
        questions,
        menu
    ) {

        const questionArea =
            content.querySelector(
                ".question-modal-question"
            );

        questionArea.innerHTML = "";

        const question =
            questions[selectedQuestion];

        if (!question) {

            selectedQuestion = 0;

            return;
        }

        const clone =
            question.cloneNode(true);

        /*
         * The clone must not be treated
         * as an original quiz question.
         */
        
        clone.classList.remove("ansDiv");

        /*
         * Avoid duplicate IDs.
         */

        clone
            .querySelectorAll("[id]")
            .forEach(
                element => {
                    element.removeAttribute("id");
                }
            );

        clone.removeAttribute("id");
        

        questionArea.appendChild(clone);
        clone
            .querySelectorAll(
                'input[type="radio"]'
            )
            .forEach(input => {
                input.name =
                    `modal-q-${selectedQuestion}`;
            });


        /*
         * Modal answer click proxy
         */

        const modalAnswers =
            clone.querySelectorAll(
                ".answerLabel"
            );

        const realAnswers =
            questions[selectedQuestion]
                .querySelectorAll(
                    ".answerLabel"
                );

        modalAnswers.forEach(
            (modalAnswer, index) => {

                modalAnswer.addEventListener(
                    "click",
                    () => {

                        const realAnswer =
                            realAnswers[index];

                        if (!realAnswer) {
                            return;
                        }

                        // Click the real answer
                        realAnswer.click();

                        // Remove selected state
                        // from all modal answers
                        modalAnswers.forEach(
                            answer => {
                                answer.parentElement
                                    .classList
                                    .remove(
                                        "clicked"
                                    );
                            }
                        );

                        // Copy selected state
                        // from real answer
                        if (
                            realAnswer
                                .parentElement
                                .classList
                                .contains(
                                    "clicked"
                                )
                        ) {

                            modalAnswer
                                .parentElement
                                .classList
                                .add(
                                    "clicked"
                                );
                        }
                    }
                );
            }
        );

        /*
         * Keep menu selection synchronized.
         */

        menu
            .querySelectorAll(
                ".question-modal-menu-item"
            )
            .forEach(
                (button, index) => {

                    button.classList.toggle(
                        "is-selected",
                        index === selectedQuestion
                    );
                }
            );

        /*
         * Do NOT recalculate the user's
         * font scale here.
         *
         * updateFontSize() uses the existing
         * modalFontScale.
         */

        updateFontSize();
    }

    function close() {

        if (!modal) {
            return;
        }

        modal.classList.remove("is-open");
    }

    function removeOpenButton() {

        if (openButton) {

            openButton.remove();

            openButton = null;
        }
    }

    function showButton(articleId) {

        if (currentArticleId !== articleId) {

            selectedQuestion = 0;

            currentArticleId = articleId;
        }

        createOpenButton();
    }

    function hideButton() {

        removeOpenButton();
    }

    return {
        init,
        open,
        close,
        showButton,
        hideButton,
        update
    };

})();


function updateFontSize() {
    const windowElement =
        modal.querySelector(".question-modal-window");

    const width =
        windowElement.getBoundingClientRect().width;

    const baseFontSize = Math.max(
        0.85,
        Math.min(1.25, width * 0.0015)
    );

    const fontSize =
        baseFontSize * modalFontScale;

    windowElement.style.setProperty(
        "--question-font-size",
        `${fontSize}rem`
    );

    windowElement.style.setProperty(
        "--question-modal-header-font-size",
        `${1.1 * modalFontScale}rem`
    );

    windowElement.style.setProperty(
        "--question-modal-scale",
        modalFontScale
    );

    modal
        .querySelector(".question-modal-font-size")
        .textContent =
            `${Math.round(modalFontScale * 100)}%`;
}
// Make it available globally
window.QuestionModal = QuestionModal;