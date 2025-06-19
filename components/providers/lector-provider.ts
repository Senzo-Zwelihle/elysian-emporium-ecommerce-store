"use client";

import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

console.log(
  "PDF.js worker configured for client-side use:",
  GlobalWorkerOptions.workerSrc
);
