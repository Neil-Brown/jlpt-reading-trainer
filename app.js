const menu = document.getElementById("menu");
const articleButtons = [];
const search = document.getElementById("search");


/* =========================================================
   SEARCH
   ========================================================= */

search.addEventListener("input", () => {

    const text = search.value.toLowerCase().trim();

    articleButtons.forEach(article => {

        article.button.style.display =
            article.title.includes(text)
                ? ""
                : "none";

    });

});


/* =========================================================
   GET ARTICLE TITLE
   ========================================================= */

async function getTitle(file) {

    const html = await fetch(file).then(r => r.text());

    const doc = new DOMParser().parseFromString(html, "text/html");

    return (
        doc.getElementById("articleTitle")?.textContent.trim() ||
        doc.title ||
        file
    );

}


/* =========================================================
   LOAD ARTICLE MENU
   ========================================================= */

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
            window.location.href = file;
        };

        menu.appendChild(button);

    }

}


/* =========================================================
   START
   ========================================================= */

loadMenu();