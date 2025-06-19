import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function BillboardNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-20 text-center">
      <FileQuestion className="h-20 w-20 text-muted-foreground mb-6" />
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Billboard Not Found
      </h2>
      <p className="text-muted-foreground mb-6">
        The billboard you're looking for doesn't exist or you
        don't have permission to view it.
      </p>
      <Button asChild>
        <Link href="/admin/billboards">Back to billboards</Link>
      </Button>
    </div>
  );
}
