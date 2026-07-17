import { writeFile } from "node:fs/promises";

const [url, output, width = "390", height = "844", port = "9222"] = process.argv.slice(2);
if (!url || !output) {
  console.error("Usage: node scripts/capture.mjs <url> <output.png> [width] [height] [debug-port]");
  process.exit(1);
}

const targets = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
const target = targets.find(t => t.type === "page");
if (!target) throw new Error("No Chrome page target found");

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const ready = new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});
ws.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  message.error ? reject(new Error(message.error.message)) : resolve(message.result);
});

await ready;
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id;
  pending.set(requestId, { resolve, reject });
  ws.send(JSON.stringify({ id: requestId, method, params }));
});

await send("Page.enable");
await send("Performance.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: Number(width), height: Number(height), deviceScaleFactor: 1, mobile: true,
  screenWidth: Number(width), screenHeight: Number(height)
});
await send("Page.navigate", { url });
await new Promise(resolve => setTimeout(resolve, 900));
const dimensions = await send("Runtime.evaluate", { expression: `JSON.stringify({innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth})`, returnByValue: true });
const timing = await send("Runtime.evaluate", { expression: `JSON.stringify({navigation:performance.getEntriesByType('navigation').map(({domContentLoadedEventEnd,loadEventEnd,transferSize,encodedBodySize})=>({domContentLoadedEventEnd,loadEventEnd,transferSize,encodedBodySize})),resources:performance.getEntriesByType('resource').map(({name,transferSize,encodedBodySize,duration})=>({name,transferSize,encodedBodySize,duration}))})`, returnByValue: true });
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
await writeFile(output, Buffer.from(shot.data, "base64"));
console.log(JSON.stringify({ viewport: JSON.parse(dimensions.result.value), performance: JSON.parse(timing.result.value) }, null, 2));
ws.close();
