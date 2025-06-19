import { SparklesCore } from "@/components/core/sparkles";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { InfiniteSlider } from "@/components/core/infinite-slider";
import Image from "next/image";
import { ProgressiveBlur } from "@/components/core/progressive-blur";

async function fetchBrands() {
  const brands = await prisma.brand.findMany({
    select: {
      id: true,
      company: true,
      logo: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return brands;
}

const ProductBrands = async () => {
  noStore();
  const brands = await fetchBrands();
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} id="brands">
      <Heading
        size={"md"}
        font={"PolySansMedian"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        Brands
      </Heading>

      <div className="relative py-6 ">
        <InfiniteSlider speed={40} speedOnHover={20} gap={112}>
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center">
              <Image
                src={brand.logo || "/svg/vercel-placeholder.svg"}
                alt={brand.company}
                height={100}
                width={100}
                className="mx-auto object-contain "
              />
            </div>
          ))}
        </InfiniteSlider>

        {/* Fading edge gradients and blur */}
        <div className="bg-gradient-to-r from-background absolute inset-y-0 left-0 w-20" />
        <div className="bg-gradient-to-l from-background absolute inset-y-0 right-0 w-20" />

        <ProgressiveBlur
          className="pointer-events-none absolute left-0 top-0 h-full w-20"
          direction="left"
          blurIntensity={1}
        />
        <ProgressiveBlur
          className="pointer-events-none absolute right-0 top-0 h-full w-20"
          direction="right"
          blurIntensity={1}
        />
      </div>

      <div className="relative -mt-36 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#4D00FF,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-background after:bg-background">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          particleDensity={300}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    </Container>
  );
};

export default ProductBrands;
