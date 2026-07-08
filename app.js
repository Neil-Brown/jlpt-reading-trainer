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

    return doc.title || file;
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
            margin: 0 auto;
            padding: 24px;
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
            white-space: pre-wrap;
            word-break: break-word;
            font-family: inherit;
            font-size: 1rem;
            line-height: 1.8;
        }

        @media (max-width: 600px) {
            body {
                padding: 1.5rem;
            }

            #articleTitle {
                font-size: 1.5rem;
            }

            #articleDate {
                margin-bottom: .8rem;
            }

            #articleBody {
                line-height: 1.7;
                font-size: 1rem;
            }
        }
    `;
}
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});

viewer.addEventListener("load", () => {
    applyZoom();
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

loadMenu();
