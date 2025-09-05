import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Promotion } from "@/types/store/promotion";
import PromotionGrid from "../promotion/promotion-grid";
import { fetchActivePromotions } from "@/app/api/store/promotion";
import { Heading } from "@/components/ui/heading";

async function fetchPromotions(): Promise<Promotion[]> {
  noStore();
  try {
    const promotions = await fetchActivePromotions();
    return promotions;
  } catch {
    return [];
  }
}

const Promotions = async () => {
  const promotions = await fetchPromotions();
// console.log(promotions)
  if (promotions.length === 0) {
    return (
      <div className="w-full h-96 rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No promotions available</p>
      </div>
    );
  }

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"auto"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="promotions"
      className="py-8"
    >
      <Heading
        font={"aeonikBold"}
        size={"md"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"md"}
      >
        Promotions
      </Heading>
      <PromotionGrid promotions={promotions} />
    </Container>
  );
};

export default Promotions;
