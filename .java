import { chromium } from "playwright";
import { access, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const entry = path.join(root, "index.html");
const output = path.join(root, "docs", "screenshots");

await access(entry).catch(() => {
  throw new Error(
    "Missing index.html. Save the complete game HTML in the repository root first."
  );
});

await mkdir(output, { recursive: true });

const worlds = [
  "aurora-reach",
  "sakura-reverie",
  "sunken-cathedral",
  "amber-dunes",
  "thunder-citadel",
  "neon-afterglow",
  "astral-garden"
];

const browser = await chromium.launch();
const errors = [];

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce"
  });

  // Fresh, muted settings for each navigation.
  await context.addInitScript(() => {
    try {
      localStorage.setItem(
        "flipside-seven-v1",
        JSON.stringify({
          bests: [0, 0, 0, 0, 0, 0, 0],
          selected: 0,
          muted: true,
          reduced: true
        })
      );
    } catch {}
  });

  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));

  const gameURL = pathToFileURL(entry).href;

  async function openGame() {
    await page.goto(gameURL, { waitUntil: "load" });
    await page.locator("#maps .map").nth(6).waitFor({
      state: "visible"
    });
    await page.evaluate(() => document.fonts.ready);
  }

  async function capture(name) {
    if (errors.length) {
      throw new Error(`Game JavaScript error:\n${errors.join("\n")}`);
    }

    await page.screenshot({
      path: path.join(output, `${name}.png`),
      fullPage: true
    });

    console.log(`Captured ${name}.png`);
  }

  await openGame();
  await page.waitForTimeout(500);
  await capture("menu");

  for (const [index, name] of worlds.entries()) {
    await openGame();

    await page.locator("#maps .map").nth(index).click();
    await page.locator("#mode").selectOption("practice");
    await page.locator("#start").click();
    await page.locator("#hud").waitFor({ state: "visible" });

    await page.keyboard.press("Space");

    // Fly long enough for gates to enter the scene.
    // Practice mode prevents a collision from ending the capture.
    for (let flap = 0; flap < 9; flap++) {
      await page.waitForTimeout(420);
      await page.keyboard.press("Space");
    }

    await capture(name);
  }

  await context.close();
  console.log("\nDone: menu plus all seven worlds captured.");
} finally {
  await browser.close();
}