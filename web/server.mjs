import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(normalize(join(fileURLToPath(new URL("..", import.meta.url)))));
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4173);
const localHost = host === "0.0.0.0" ? "127.0.0.1" : host;
const forwardedUrl =
  process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `https://${process.env.CODESPACE_NAME}-${port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : null;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${host}:${port}`);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = resolve(normalize(join(rootDir, pathname)));

    if (filePath !== rootDir && !filePath.startsWith(`${rootDir}${sep}`)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Black Halo web build running at http://${localHost}:${port}`);
  if (forwardedUrl) {
    console.log(`Black Halo Codespaces URL: ${forwardedUrl}`);
  }
});
