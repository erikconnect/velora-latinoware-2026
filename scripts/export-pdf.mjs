import { spawn } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = process.env.PDF_OUT ?? path.join(root, "Velora-Latinoware-2026.pdf");
const previewUrl = process.env.PREVIEW_URL ?? "http://127.0.0.1:4173/";
const previewPort = new URL(previewUrl).port || "4173";
const previewHost = new URL(previewUrl).hostname || "127.0.0.1";

const chromePath =
  process.env.CHROME_PATH ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : "google-chrome");

async function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok) {
        return;
      }
    } catch {
      // preview ainda subindo
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error(`Preview não respondeu a tempo: ${url}`);
}

function spawnPreview() {
  return spawn("pnpm", ["preview", "--host", previewHost, "--port", previewPort], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "0" },
  });
}

async function main() {
  let preview = null;
  let ownsPreview = false;

  try {
    await waitForServer(previewUrl, 2_500);
  } catch {
    preview = spawnPreview();
    ownsPreview = true;
    await waitForServer(previewUrl);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(previewUrl, { waitUntil: "networkidle0", timeout: 120_000 });
    await page.emulateMediaType("print");
    await page.pdf({
      path: out,
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const { size } = statSync(out);
    console.log(`PDF gerado: ${out}`);
    console.log(`Tamanho: ${(size / 1024 / 1024).toFixed(2)} MB`);
  } finally {
    await browser.close();

    if (ownsPreview && preview) {
      preview.kill("SIGTERM");
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
