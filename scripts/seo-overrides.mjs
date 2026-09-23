import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const overrides = [
  {
    file: join(root, "dist", "about", "index.html"),
    replacements: [
      [
        "About Muhammad Haris Aslam | GCC Operator",
        "Muhammad Haris Aslam | GCC Growth & Transformation Executive"
      ],
      [
        "Muhammad Haris Aslam is a GCC operator and business builder with experience across digital commerce, retail, marketplaces, enterprise technology and applied AI.",
        "Muhammad Haris Aslam is a GCC operator and advisor across digital commerce, marketplaces, retail turnaround, AI, fintech, enterprise technology and growth."
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
