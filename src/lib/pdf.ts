// Client-side PDF text extraction using pdfjs-dist.
// Loaded dynamically so it doesn't bloat the main bundle.

export async function extractPdfText(file: File): Promise<string> {
  if (typeof window === "undefined") throw new Error("PDF parsing is browser-only.");

  // Dynamic import keeps pdfjs out of the SSR bundle
  const pdfjs = await import("pdfjs-dist");

  // Worker setup — serve same-origin from /public so there's no CDN dependency,
  // no CORS surprise, and no version drift.
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
    pdfjs.GlobalWorkerOptions.workerSrc = `${base}/pdf.worker.min.mjs`;
  }

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
