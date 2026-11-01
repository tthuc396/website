import fs from "node:fs/promises";
import path from "node:path";

const deployRoot = path.resolve(process.env.ASINA_DEPLOY_DIR || "site-release-i03c");
const context = process.env.CONTEXT || "production";

if (context === "production") {
  console.log("Production context: preserving the approved indexable site artifact.");
  process.exit(0);
}

async function htmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(target));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}

const pages = await htmlFiles(deployRoot);
for (const file of pages) {
  const html = await fs.readFile(file, "utf8");
  let foundRobots = false;
  const previewHtml = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (!/\bname=["']robots["']/i.test(tag)) return tag;
    foundRobots = true;
    if (/\bcontent=["'][^"']*["']/i.test(tag)) {
      return tag.replace(/\bcontent=["'][^"']*["']/i, 'content="noindex,nofollow"');
    }
    return tag.replace(/\s*\/?>$/, ' content="noindex,nofollow">');
  });
  const finalHtml = foundRobots
    ? previewHtml
    : previewHtml.replace(/<head\b[^>]*>/i, (head) => `${head}<meta name="robots" content="noindex,nofollow">`);
  await fs.writeFile(file, finalHtml);
}

await fs.writeFile(path.join(deployRoot, "robots.txt"), "User-agent: *\nAllow: /\n");
await fs.writeFile(path.join(deployRoot, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
const headersPath = path.join(deployRoot, "_headers");
let headers = await fs.readFile(headersPath, "utf8");
if (!/X-Robots-Tag:\s*noindex/i.test(headers)) {
  headers = headers.replace(/^(\/\*\s*\r?\n)/m, "$1  X-Robots-Tag: noindex, nofollow, noarchive\n");
}
await fs.writeFile(headersPath, headers);
console.log(`Non-production context (${context}): applied noindex to ${pages.length} HTML files and removed sitemap URLs.`);
