import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".webp": "image/webp", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8" };
const port = Number(process.argv[2] || 4173);
createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  if (pathname.includes("..")) { response.writeHead(400); response.end(); return; }
  const target = join(root, pathname.endsWith("/") ? `${pathname}index.html` : pathname.includes(".") ? pathname : `${pathname}/index.html`);
  try {
    if (!(await stat(target)).isFile()) throw new Error("not a file");
    response.writeHead(200, { "Content-Type": mime[extname(target)] || "application/octet-stream" });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(join(root, "404.html")));
  }
}).listen(port, "127.0.0.1", () => console.log(`Preview server: http://127.0.0.1:${port}`));
