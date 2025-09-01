import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="loading"
      className="my-4 space-y-4"
    >
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1">
          <Skeleton className="h-8 w-80 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Main image skeleton */}
                <Skeleton className="aspect-square w-full rounded-lg" />

                {/* Thumbnail images skeleton */}
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="aspect-square w-full rounded-md"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Information Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-3/4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-10 w-24 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Left column info */}
                  {[...Array(4)].map((_, index) => (
                    <div key={index}>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {/* Right column info */}
                  <div>
                    <Skeleton className="h-4 w-12 mb-1" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-4 w-4" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs Skeleton */}
          <Card>
            <CardContent className="p-6">
              {/* Tabs skeleton */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>

              {/* Tab content skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />

                <div className="space-y-3 mt-6">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
