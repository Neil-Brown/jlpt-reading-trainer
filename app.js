const menu = document.getElementById("menu");
const viewer = document.getElementById("viewer");

const files = [
    {
        name: "Test Article",
        file: "articles/test.html"
    }
];

menu.innerHTML = "";

files.forEach(item => {
    const button = document.createElement("button");

    button.textContent = item.name;
    button.style.display = "block";
    button.style.width = "100%";
    button.style.marginBottom = "10px";

    button.onclick = () => {
        viewer.src = item.file;
    };

    menu.appendChild(button);
});
