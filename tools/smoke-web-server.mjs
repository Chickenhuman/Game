import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 4175;
const host = "127.0.0.1";
const baseUrl = `http://${host}:${port}`;

const server = spawn("node", ["web/server.mjs"], {
  cwd: process.cwd(),
  env: { ...process.env, HOST: host, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let stdout = "";
let stderr = "";
server.stdout.on("data", (chunk) => {
  stdout += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Web server exited early with code ${server.exitCode}\n${stderr || stdout}`);
    }
    try {
      const response = await fetch(`${baseUrl}/index.html`);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the server accepts requests.
    }
    await delay(250);
  }
  throw new Error(`Timed out waiting for web server\n${stderr || stdout}`);
}

try {
  await waitForServer();

  const [rootIndex, webIndex, gameJs] = await Promise.all([
    fetch(`${baseUrl}/index.html`).then((response) => response.text()),
    fetch(`${baseUrl}/web/index.html`).then((response) => response.text()),
    fetch(`${baseUrl}/web/game.js`).then((response) => response.text())
  ]);

  assert(rootIndex.includes('id="goalText"'), "Root index did not serve the dynamic goal markup");
  assert(rootIndex.includes('data-i18n="ctrl_ability_label"'), "Root index did not serve the ability control row");
  assert(webIndex.includes('id="goalText"'), "web/index.html did not serve the dynamic goal markup");
  assert(gameJs.includes("cinder_dive"), "Served game.js is missing the Cinder Dive remake data");
  assert(gameJs.includes("archive_cloister"), "Served game.js is missing the Archive Cloister data");

  console.log("smoke-web-server: server booted and served remake assets correctly");
} finally {
  server.kill("SIGTERM");
  await delay(150);
}
