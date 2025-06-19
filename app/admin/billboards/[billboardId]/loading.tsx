import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export default function BillboardLoading() {
  return (
    <Container size={"2xl"} height={"screen"} padding={"md"}>
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Skeleton className="h-6 w-32" />
      </div>

      <div className=" mx-auto space-y-8 md:space-y-12">
        <Skeleton className="w-full aspect-[21/9] rounded-xl" />

        <div className="space-y-6 px-2 md:px-6">
          <Skeleton className="h-12 w-3/4" />

          <Skeleton className="h-1 w-full my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
