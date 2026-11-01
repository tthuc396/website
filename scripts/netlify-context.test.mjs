import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "netlify-context.mjs");

test("deploy previews expose noindex without hiding the directive from crawlers", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "asina-netlify-preview-"));
  try {
    await fs.mkdir(path.join(root, "nested"));
    await fs.writeFile(path.join(root, "index.html"), '<html><head><meta name="robots" content="index,follow"></head></html>');
    await fs.writeFile(path.join(root, "nested", "index.html"), '<html><head></head></html>');
    await fs.writeFile(path.join(root, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://asinaglobal.com/sitemap.xml\n");
    await fs.writeFile(path.join(root, "sitemap.xml"), "<urlset><loc>https://asinaglobal.com/</loc></urlset>");
    await fs.writeFile(path.join(root, "_headers"), "/*\n  Strict-Transport-Security: max-age=31536000\n");

    const result = spawnSync(process.execPath, [script], {
      env: { ...process.env, CONTEXT: "deploy-preview", ASINA_DEPLOY_DIR: root },
      encoding: "utf8"
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    for (const file of [path.join(root, "index.html"), path.join(root, "nested", "index.html")]) {
      assert.match(await fs.readFile(file, "utf8"), /name="robots" content="noindex,nofollow"/);
    }
    assert.match(await fs.readFile(path.join(root, "robots.txt"), "utf8"), /Allow: \/\s/);
    assert.doesNotMatch(await fs.readFile(path.join(root, "robots.txt"), "utf8"), /Sitemap:/);
    assert.doesNotMatch(await fs.readFile(path.join(root, "sitemap.xml"), "utf8"), /<loc>/);
    const headers = await fs.readFile(path.join(root, "_headers"), "utf8");
    assert.match(headers, /X-Robots-Tag: noindex, nofollow, noarchive/);
    assert.match(headers, /Strict-Transport-Security/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("production context leaves the indexable release artifact unchanged", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "asina-netlify-production-"));
  try {
    const page = path.join(root, "index.html");
    const source = '<html><head><meta name="robots" content="index,follow"></head></html>';
    await fs.writeFile(page, source);
    const result = spawnSync(process.execPath, [script], {
      env: { ...process.env, CONTEXT: "production", ASINA_DEPLOY_DIR: root },
      encoding: "utf8"
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(await fs.readFile(page, "utf8"), source);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
