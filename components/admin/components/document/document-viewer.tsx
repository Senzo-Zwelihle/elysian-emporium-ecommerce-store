"use client";

import { useEffect } from "react";
import {
  CanvasLayer,
  CurrentPage,
  CurrentZoom,
  Page,
  Pages,
  Root,
  TextLayer,
  ZoomIn,
  ZoomOut,
} from "@anaralabs/lector";
import "@/components/providers/lector-provider";

interface PdfViewerProps {
  pdfUrl: string;
}

const DocumentViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  useEffect(() => {
    // console.log("PdfViewer mounted on client side.");
  }, []);
  return (
    <Root
      source={pdfUrl}
      className="bg-gray-100 border rounded-md overflow-hidden relative h-[700px] flex flex-col justify-stretch"
      loader={<div className="p-4">Loading...</div>}
    >
      {/* Control Bar */}
      <div className="bg-gray-100 border-b p-1 flex items-center justify-center text-sm text-gray-600 gap-2">
        <span className="flex-grow" />
        Page
        <CurrentPage className="bg-white rounded-full px-3 py-1 border text-center" />
        Zoom
        <ZoomOut className="px-3 py-1 -mr-2 text-gray-900">-</ZoomOut>
        <CurrentZoom className="bg-white rounded-full px-3 py-1 border text-center w-16" />
        <ZoomIn className="px-3 py-1 -ml-2 text-gray-900">+</ZoomIn>
        <span className="flex-grow" />
      </div>
      <Pages className="dark:invert-[94%] dark:hue-rotate-180 dark:brightness-[80%] dark:contrast-[228%]">
        <Page>
          <CanvasLayer />
          <TextLayer />
        </Page>
      </Pages>
    </Root>
  );
};

export default DocumentViewer;
