import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const overrides = [
  {
    file: join(root, "dist", "about", "index.html"),
    replacements: [
      [
        "About Muhammad Haris Aslam | GCC Operator",
        "Muhammad Haris Aslam | GCC Operating Profile"
      ],
      [
        "Muhammad Haris Aslam is a GCC operator and business builder with experience across digital commerce, retail, marketplaces, enterprise technology and applied AI.",
        "Muhammad Haris Aslam is a GCC operator and business builder across growth, retail, digital commerce, marketplaces, enterprise technology and applied AI."
      ]
    ]
  },
  {
    file: join(root, "dist", "insights", "distributor-cash-allocation-operating-system-ai", "index.html"),
    replacements: [
      [
        "A practical AI operating framework for GCC distributors connecting inventory, supplier terms, customer credit and net-net contribution-with human-controlled decision rights.",
        "A practical AI operating framework for GCC distributors linking inventory, supplier terms, customer credit and net-net contribution under human control."
      ]
    ]
  }
];

for (const override of overrides) {
  let html = await readFile(override.file, "utf8");

  for (const [from, to] of override.replacements) {
    if (!html.includes(from)) {
      throw new Error(`SEO override source text not found in ${override.file}: ${from}`);
    }
    html = html.replaceAll(from, to);
  }

  await writeFile(override.file, html, "utf8");
}


async function listHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listHtmlFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

const gaLoader = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-QW1VSXTK3G"></script>';
const gaGuard = "<script>window['ga-disable-G-QW1VSXTK3G'] = navigator.webdriver === true || window.location.hostname.endsWith('.vercel.app');</script>\n  " + gaLoader;

for (const file of await listHtmlFiles(join(root, "dist"))) {
  let html = await readFile(file, "utf8");
  if (!html.includes(gaLoader)) continue;
  html = html.replace(gaLoader, gaGuard);
  await writeFile(file, html, "utf8");
}
