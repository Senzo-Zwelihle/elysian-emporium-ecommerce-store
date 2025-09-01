"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import ModalDocumentViewer from "./document-modal-viewer";
import { User } from "@/lib/generated/prisma";

interface DocumentModalProps {
  documentUrl: string;
  documentName: string;
  documentUser: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentModal = ({
  documentUrl,
  documentName,
  documentUser,
  open,
  onOpenChange,
}: DocumentModalProps) => {
  const { theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] p-2 flex flex-col",
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        )}
      >
        <ModalDocumentViewer
          documentUrl={documentUrl}
          documentName={documentName}
          documentUser={documentUser}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentModal;