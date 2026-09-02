const menu = document.getElementById("menu");
const viewer = document.getElementById("viewer");
const articleButtons = [];
let zoom = 100;
const search = document.getElementById("search");

search.addEventListener("input", () => {

    const text = search.value.toLowerCase().trim();

    articleButtons.forEach(article => {

        article.button.style.display =
            article.title.includes(text)
                ? ""
                : "none";

    });

});

async function getTitle(file) {
    const html = await fetch(file).then(r => r.text());

    const doc = new DOMParser().parseFromString(html, "text/html");

    return (
        doc.getElementById("articleTitle")?.textContent.trim() ||
        doc.title ||
        file
    );
}

async function loadMenu() {
    const files = await fetch("files.json").then(r => r.json());

    for (const file of files) {

        const title = await getTitle(file);

        const button = document.createElement("button");
        button.className = "articleButton";
        button.textContent = title;
        articleButtons.push({
            title: title.toLowerCase(),
            button
        });

        button.onclick = () => {
            viewer.src = file;

            // Hide menu after selecting an article on mobile
            if (window.innerWidth <= 600) {
                menu.classList.add("hidden");
            }
        };
        menu.appendChild(button);
    }
}

function applyZoom() {
    const doc = viewer.contentDocument;

    if (!doc) return;

    let style = doc.getElementById("zoom-style");

    if (!style) {
        style = doc.createElement("style");
        style.id = "zoom-style";
        doc.head.appendChild(style);
    }

  style.textContent = `
    html {
        font-size: ${zoom}%;
    }

    body {
        font-family: "Yu Gothic", "Hiragino Sans", Meiryo, sans-serif;

        margin: 0;
        padding: 24px;

        width: 100%;
        max-width: 100%;

        box-sizing: border-box;

        overflow-x: hidden;

        line-height: 1.8;
        color: #222;
        background: #fff;
    }

    #articleTitle {
        margin: 0 0 12px;
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 1.4;
        color: #1f2937;
    }

    #articleDate {
        margin-bottom: 24px;
        color: #6b7280;
        font-size: 0.95rem;
    }

    #articleBody {
        margin: 0;
        padding: 0;

        width: 100%;
        max-width: 100%;

        box-sizing: border-box;

        white-space: normal;

        overflow-x: hidden;

        overflow-wrap: anywhere;
        word-break: break-word;

        font-family: inherit;
        font-size: 1rem;
        line-height: 1.8;
    }


    /* =========================
       Generic article tables
       ========================= */

    .article-table {
        width: 100%;
        max-width: 100%;

        border-collapse: collapse;

        margin: 0;

        font-size: 1rem;
        line-height: 1.6;

        table-layout: fixed;

        box-sizing: border-box;
    }

    .article-table th,
    .article-table td {
        border: 1px solid #aaa;

        padding: 0.6em;

        text-align: left;
        vertical-align: top;

        overflow-wrap: anywhere;
        word-break: break-word;

        box-sizing: border-box;
    }

    .article-table th {
        font-weight: bold;
    }

    .article-table .table-name {
        font-weight: bold;
    }


    /* =========================
       Article notes
       ========================= */

    .article-notes {
        margin: 1em 0 0;
        padding: 0;
    }

    .article-notes p {
        margin: 0 0 0.5em;
        padding: 0;
    }


    /* =========================
       Reading quiz
       ========================= */

    .reading-quiz {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;

        margin-top: 2em;
        padding-top: 1em;

        border-top: 2px solid #ddd;
    }

    .reading-quiz h2 {
        margin: 0 0 1.5em;
    }

    .question {
        width: 100%;
        max-width: 100%;
        margin-bottom: 2em;
        box-sizing: border-box;
    }

    .question p {
        margin: 0 0 0.8em;
    }

    .question label {
        display: inline-flex;

        align-items: center;

        width: calc(50% - 0.5em);

        min-height: 3em;

        margin: 0.25em 0;

        padding: 0.6em 0.8em;

        cursor: pointer;

        border-radius: 5px;

        vertical-align: top;

        box-sizing: border-box;

        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .question label:hover {
        background: #f5f5f5;
    }

    .question input {
        margin: 0 0.5em 0 0;
        flex-shrink: 0;
    }


    /* Selected answer */

    .question label.quiz-selected {
        background: #dbeafe;
    }


    /* Correct answer */

    .question label.quiz-correct {
        background: #c6f6d5;
        color: #166534;
    }


    /* Incorrect answer */

    .question label.quiz-incorrect {
        background: #fecaca;
        color: #991b1b;
    }


    /* Check button */

    #checkAnswers {
        padding: 0.7em 1.5em;

        font-size: 1rem;

        cursor: pointer;
    }


    /* Quiz results */

    #quizResults {
        margin-top: 1.5em;
        padding: 1em;

        font-weight: bold;

        display: none;

        box-sizing: border-box;

        max-width: 100%;
    }


    /* =========================
       Mobile
       ========================= */

    @media (max-width: 700px) {

        .article-table,
        .article-table thead,
        .article-table tbody,
        .article-table tr,
        .article-table th,
        .article-table td {
            display: block;
            width: 100%;
        }

        .article-table thead {
            display: none;
        }

        .article-table tr {
            border: 1px solid #aaa;

            margin-bottom: 1.2em;

            padding: 0.4em 0;

            box-sizing: border-box;
        }

        .article-table td {
            border: none;
            border-bottom: 1px solid #ddd;

            padding: 0.55em 0.8em 0.55em 7em;

            position: relative;

            min-height: 1.6em;

            box-sizing: border-box;
        }

        .article-table td:last-child {
            border-bottom: none;
        }

        .article-table td::before {
            content: attr(data-label);

            position: absolute;

            left: 0.8em;
            top: 0.55em;

            width: 5.5em;

            font-weight: bold;
        }

        .article-table .table-name {
            font-size: 1.1rem;

            padding-left: 0.8em;

            border-bottom: 1px solid #aaa;
        }

        .article-table .table-name::before {
            display: none;
        }


        /* Quiz answers stack on mobile */

       .question {
    margin-bottom: 2em;
}

.question p {
    margin: 0 0 0.8em;
}

.answers {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5em 1em;
}

.question label {
    display: flex;
    align-items: center;
    min-height: 3em;
    padding: 0.6em 0.8em;
    cursor: pointer;
    border-radius: 5px;
    box-sizing: border-box;
}

.question label:hover {
    background: #f5f5f5;
}

.question input {
    margin: 0 0.5em 0 0;
    flex-shrink: 0;
}

/* Mobile */
@media (max-width: 600px) {

    .answers {
        grid-template-columns: 1fr;
        gap: 0.4em;
    }

    .question label {
        width: 100%;
    }

}
    /* =========================
       Small mobile adjustments
       ========================= */

    @media (max-width: 600px) {

        body {
            padding: 1.5rem;
        }

        #articleTitle {
            font-size: 1.5rem;
        }

        #articleDate {
            margin-bottom: 0.8rem;
        }

        #articleBody {
            font-size: 1rem;
            line-height: 1.7;
        }

        .reading-quiz {
            margin-top: 1.5em;
        }
    }
    .vocabulary {
        margin: 3rem 0;
        padding: 1.5rem 2rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
    }
}

.vocabulary h2 {
    margin: 1.5rem 0 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e2e8f0;
    font-size: 1.4rem;
}

.vocabulary dl {
    margin: 0;
}

.vocab-item {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
}

.vocab-item:last-child {
    border-bottom: none;
}

.vocab-item dt {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
}

.vocab-item rt {
    font-size: 0.6em;
    color: #6b7280;
}

.vocab-item dd {
    margin: 0;
    color: #4b5563;
    line-height: 1.7;
}

@media (max-width: 700px) {
    .vocab-item {
        grid-template-columns: 1fr;
        gap: 0.25rem;
    }
}
`;
}
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});

viewer.addEventListener("load", () => {
    applyZoom()
    const doc = viewer.contentDocument;
    if (doc.querySelector(".reading-quiz")) {
        const script = doc.createElement("script");
        script.src = "../js/quiz.js";
        doc.body.appendChild(script);
    }
});

document.getElementById("zoomIn").onclick = () => {
    zoom += 10;
    applyZoom();
};

document.getElementById("zoomOut").onclick = () => {
    zoom -= 10;
    applyZoom();
};

const yomitanHelp = document.getElementById("yomitanHelp");
const yomitanModal = document.getElementById("yomitanModal");
const closeYomitan = document.getElementById("closeYomitan");

yomitanHelp.onclick = () => {
    yomitanModal.style.display = "block";
};



closeYomitan.onclick = () => {
    yomitanModal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === yomitanModal) {
        yomitanModal.style.display = "none";
    }
};

document.addEventListener("keydown", (event) => {
    if (!event.ctrlKey) return;

    if (event.key === "ArrowUp") {
        event.preventDefault();
        zoom = Math.min(300, zoom + 10);
        applyZoom();
    }

    if (event.key === "ArrowDown") {
        event.preventDefault();
        zoom = Math.max(50, zoom - 10);
        applyZoom();
    }
});
loadMenu();
