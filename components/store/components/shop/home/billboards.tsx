import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { EmblaOptionsType } from "embla-carousel";
import Carousel, {
  Slider,
  SliderContainer,
  SliderDotButton,
} from "@/components/core/carousel";
import { prisma } from "@/lib/client/prisma";

async function fetchBillboards() {
  const billboards = await prisma.billboard.findMany({
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      url: true,
      state: true,
      category: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return billboards;
}

const Billboards = async () => {
  noStore();
  const billboards = await fetchBillboards();
  const OPTIONS: EmblaOptionsType = { loop: true };
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} id="billboards">
      <Heading
        size={"md"}
        font={"PolySansMedian"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        Explore
      </Heading>

      <Carousel options={OPTIONS} isAutoPlay={true}>
        <SliderContainer className="gap-4">
          {billboards.map((billboard) => (
            <Slider key={billboard.id} className="w-full">
              <div className="relative h-[60vh] lg:h-[80vh] w-full rounded-xl overflow-hidden bg-black">
                <Image
                  src={billboard.image}
                  alt={billboard.label}
                  fill
                  className="object-cover w-full h-full"
                  quality={95}
                  priority
                />
                <div className="absolute top-6 left-6 bg-black/60 text-white p-6 rounded-xl shadow-lg max-w-[80%] transition-transform hover:scale-[1.02]">
                  <h2 className="text-xl lg:text-4xl font-bold">
                    {billboard.label}
                  </h2>
                  {billboard.description && (
                    <p className="text-sm lg:text-base mt-2">
                      {billboard.description}
                    </p>
                  )}
                </div>
              </div>
            </Slider>
          ))}
        </SliderContainer>

        <div className="flex justify-center py-4">
          <SliderDotButton />
        </div>
      </Carousel>
    </Container>
  );
};

export default Billboards;
