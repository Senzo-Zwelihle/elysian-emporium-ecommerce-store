"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  MoreVerticalIcon,
  Trash2Icon,
  FilePenIcon,
  CircleDotIcon,
  CircleXIcon,
  PenLineIcon,
  ArchiveIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Document as PrismaDocument,
  Status,
  User,
} from "@/lib/generated/prisma";
import { deleteDocumentAction } from "@/server/actions/admin/document";

import DocumentModal from "./document-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

type DocumentCardProps = Omit<PrismaDocument, "userId"> & {
  onToggleStar: (id: string) => void;
  onDownload?: (id: string) => void;
  user: User;
};

const DocumentCard = ({
  id,
  name,
  status,
  file,
  starred,
  onToggleStar,
  updatedAt,
  user,
}: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const newWidth = entries[0]?.contentRect.width;
      if (newWidth) {
        setContainerWidth(Math.floor(newWidth));
      }
    });

    observer.observe(containerRef.current);
    setContainerWidth(
      Math.floor(containerRef.current.getBoundingClientRect().width)
    );

    return () => observer.disconnect();
  }, []);

  const getStatusDisplay = (status: Status) => {
    switch (status) {
      case Status.active:
        return (
          <div className="flex items-center text-emerald-500">
            <CircleDotIcon className="h-4 w-4 mr-1" />
            <p>Active</p>
          </div>
        );
      case Status.inactive:
        return (
          <div className="flex items-center text-slate-500">
            <CircleXIcon className="h-4 w-4 mr-1" />
            <p>Inactive</p>
          </div>
        );
      case Status.draft:
        return (
          <div className="flex items-center text-indigo-500">
            <PenLineIcon className="h-4 w-4 mr-1" />
            <p>Draft</p>
          </div>
        );
      case Status.archived:
        return (
          <div className="flex items-center text-orange-500">
            <ArchiveIcon className="h-4 w-4 mr-1" />
            <p>Archived</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDocumentAction(id);
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        <div
          ref={containerRef}
          className="relative flex h-48 w-full items-center justify-center bg-muted/30 p-2"
        >
          <Document
            file={file}
            loading={<Spinner />}
            className="h-full w-full overflow-hidden rounded-md"
            renderMode="canvas"
          >
            <Page
              pageNumber={1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={containerWidth ? Math.min(containerWidth, 900) : undefined}
            />
          </Document>
        </div>

        {/* Action buttons */}
        <div className="absolute right-2 top-2 flex items-center space-x-2">
          {/* Star button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(id);
            }}
            title={starred ? "Unstar" : "Star"}
          >
            <StarIcon
              className={cn(
                "size-4",
                starred
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </Button>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVerticalIcon className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/admin/documents/${id}/update`}>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <FilePenIcon className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="text-destructive"
                variant="destructive"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 text-base font-medium leading-tight">
              {name}
            </h3>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {getStatusDisplay(status)}
            <p className="text-xs">
              {format(new Date(updatedAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <DocumentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        documentUrl={file}
        documentName={name}
        documentUser={user}
      />
    </>
  );
};

export default DocumentCard;
