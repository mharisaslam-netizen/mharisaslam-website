import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const overrides = [
  {
    file: join(root, "dist", "about", "index.html"),
    replacements: [
      [
        "Muhammad Haris Aslam | GCC Commercial & Transformation Executive",
        "Muhammad Haris Aslam | GCC Commercial, Growth & Transformation Executive"
      ],
      [
        "Muhammad Haris Aslam is a GCC commercial and transformation executive with experience across digital commerce, retail, marketplaces, enterprise technology, fintech and AI.",
        "Muhammad Haris Aslam is a GCC commercial and transformation executive across digital commerce, marketplaces, retail turnaround, AI, fintech, enterprise technology and growth."
      ]
    ]
  },
  {
    file: join(root, "dist", "insights", "distributor-cash-allocation-operating-system-ai", "index.html"),
    replacements: [
      [
        "A practical AI operating framework for GCC distributors connecting inventory, supplier terms, customer credit and net-net contribution-with human-controlled decision rights.",
        "How GCC distributors can use AI to link inventory, supplier terms, customer credit and net-net contribution while keeping decision rights with people."
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
