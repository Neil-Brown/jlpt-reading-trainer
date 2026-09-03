const fs = require("fs");

const baseUrl = "https://neil-brown.github.io/jlpt-reading-trainer";

const files = JSON.parse(
    fs.readFileSync("files.json", "utf8")
);

const urls = [
    `<url>
        <loc>${baseUrl}/</loc>
    </url>`,
    ...files.map(file => `
    <url>
        <loc>${baseUrl}/${file}</loc>
    </url>`)
].join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemap);

console.log(`Sitemap generated with ${files.length + 1} URLs.`);