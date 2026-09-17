import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../dist/client/", import.meta.url);

// Vinext exports some routes as .html and others as directory indexes.
async function page(route) {
  for (const path of [route ? `${route}.html` : "index.html", `${route}/index.html`]) {
    try {
      return await readFile(new URL(path, output), "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  assert.fail(`Missing exported page: /${route}`);
}

test("exports the home, gallery, comics and relationship pages", async () => {
  for (const route of ["", "gallery", "comics", "relationships"]) {
    const html = await page(route);
    assert.match(html, /<html[\s>]/i);
    assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
  }
});

test("exports all six character profiles", async () => {
  for (const name of ["musubi", "yuuhi", "shuu", "akane", "sumire", "kumori"]) {
    assert.match(await page(`characters/${name}`), /<html[\s>]/i);
  }
});
