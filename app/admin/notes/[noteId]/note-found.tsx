import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoteNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <FileQuestion className="h-20 w-20 text-muted-foreground mb-6" />
      <h2 className="text-2xl font-bold tracking-tight mb-2">Note Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The note you're looking for doesn't exist or you don't
        have permission to view it.
      </p>
      <Button asChild>
        <Link href="/admin/notes">Back to Notes</Link>
      </Button>
    </div>
  );
}
