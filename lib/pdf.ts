type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (
    options: Record<string, unknown>
  ) => { promise: Promise<PdfJsDocument> };
};

type PdfJsDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfJsPage>;
};

type PdfJsPage = {
  getTextContent: () => Promise<{ items: Array<{ str?: string }> }>;
};

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
  }
}

async function ensurePdfJs(): Promise<PdfJsLib> {
  if (typeof window === "undefined") {
    throw new Error("PDF extraction is only available in the browser.");
  }

  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js"
  );

  if (!window.pdfjsLib) {
    throw new Error("Failed to load PDF.js library from CDN.");
  }

  // Disable workers to avoid loading separate worker scripts.
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "";

  return window.pdfjsLib;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`Failed to load script: ${src}`))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await ensurePdfJs();

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    disableWorker: true,
  });

  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item?.str ?? "")
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n");
}
