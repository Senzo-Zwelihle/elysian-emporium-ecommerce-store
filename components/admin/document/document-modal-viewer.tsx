
"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FileIcon,
  RotateCcwIcon,
  DownloadIcon,
  Share2Icon,
} from "lucide-react";
import { User } from "@/lib/generated/prisma";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

interface ModalDocumentViewerProps {
  documentUrl: string;
  documentName: string;
  documentUser: User;
}

const ModalDocumentViewer = ({
  documentUrl,
  documentName,
  documentUser,
}: ModalDocumentViewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;
    const el = viewerRef.current;
    const ro = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      const newWidth = entries[0]?.contentRect.width;
      if (newWidth) {
        resizeTimeoutRef.current = window.setTimeout(() => {
          setContainerWidth(Math.floor(newWidth));
        }, 100);
      }
    });

    ro.observe(el);
    setContainerWidth(Math.floor(el.getBoundingClientRect().width));

    return () => {
      ro.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handleShare = () => {
    navigator.clipboard.writeText(documentUrl);
    toast.success("Document link copied to clipboard!", {
      description: `You can now share "${documentName}" with others.`,
    });
  };

  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col p-2",
        theme === "dark" ? "bg-black" : "bg-white"
      )}
    >
      {/* Viewer Area */}
      <div
        ref={viewerRef}
        className="flex-1 overflow-auto rounded-lg shadow-inner flex justify-center items-center"
      >
        <div className="w-full h-full flex items-center justify-center">
          <Document
            file={documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center text-center">
                <Spinner className="h-10 w-10 text-primary" />
                <p className="mt-4">Loading document...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center text-center p-8">
                <FileIcon className="h-10 w-10 text-destructive mb-2" />
                <h3 className="text-xl font-semibold">
                  Failed to load document
                </h3>
                <p className="text-muted-foreground mt-2">
                  Please check the document URL or try again later.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }
            className="rounded-lg overflow-hidden"
          >
            {containerWidth && (
              <Page
                pageNumber={pageNumber}
                width={Math.min(containerWidth, 1200)}
                loading={<Spinner className="m-auto" />}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )}
          </Document>
        </div>
      </div>

      {/* Footer with Actions and Info */}
      <div className="flex items-center justify-between p-4 border-t border-border mt-auto">
        {/* Ownership Info */}
        <p className="text-sm text-muted-foreground">
          Owned by{" "}
          <span className="font-semibold text-foreground">{documentUser.name}</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2Icon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <a href={documentUrl} download={documentName}>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download
            </Button>
          </a>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Page {pageNumber} of {numPages || "..."}
        </p>
        <div className="mt-2 space-x-2">
          <Button
            type="button"
            variant={"outline"}
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            <ChevronsLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            type="button"
            variant={"outline"}
            disabled={pageNumber >= (numPages || 0)}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Next
            <ChevronsRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDocumentViewer;