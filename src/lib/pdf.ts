// Client-side PDF text extraction using pdfjs-dist.
// Loaded dynamically so it doesn't bloat the main bundle.

import { withBasePath } from "@/lib/utils";

export async function extractPdfText(file: File): Promise<string> {
  if (typeof window === "undefined") throw new Error("PDF parsing is browser-only.");

  // Dynamic import keeps pdfjs out of the SSR bundle
  const pdfjs = await import("pdfjs-dist");

  // Always set — pdfjs may default to `./pdf.worker.mjs` relative to the chunk URL,
  // which breaks on GitHub Pages (`/Hyred`). Worker is copied to /public on install.
  pdfjs.GlobalWorkerOptions.workerSrc = withBasePath("/pdf.worker.min.mjs");

  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }
  return pages.join("\n\n");
}
