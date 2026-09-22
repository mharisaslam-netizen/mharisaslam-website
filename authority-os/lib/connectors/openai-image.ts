
import type { VisualBrief } from "../../workflows/types";

export async function generateAuthorityVisual(visual: VisualBrief) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const prompt = [
    visual.imagePrompt,
    "",
    "Editorial requirements:",
    "- Board-level, premium, restrained and information-rich.",
    "- Preserve the concept and hierarchy from the creative brief.",
    "- Avoid generic AI stock imagery.",
    "- If text is rendered, keep only short headline-level text and ensure it is legible.",
    "- Do not invent statistics, logos, flags or corporate marks."
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-2.5-flare",
      prompt,
      size: "1536x864",
      quality: "medium",
      output_format: "jpeg",
      n: 1
    }),
    cache: "no-store"
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      "OpenAI image generation failed (" +
        response.status +
        "): " +
        JSON.stringify(data).slice(0, 700)
    );
  }

  const base64 = data?.data?.[0]?.b64_json;
  if (!base64) throw new Error("OpenAI image generation returned no image.");

  return {
    base64: String(base64),
    mimeType: "image/jpeg",
    extension: "jpg",
    size: data?.size || "1536x864",
    quality: data?.quality || "medium"
  };
}
