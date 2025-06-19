import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";
import { SparklesIcon } from "lucide-react";

async function fetchReviews() {
  const reviews = await prisma.review.findMany({
    select: {
      id: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      productId: true,
      product: true,
      rating: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          role: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
}

const ReviewsRoutePage = async () => {
  noStore();
  const reviews = await fetchReviews();
  // console.log(reviews);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"sm"}
        >
          Reviews
        </Heading>
      </div>

      {/* reviews data */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySansSlim"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Reviews Found!...
          </Heading>
          <SparklesIcon size={80} />
        </div>
      ) : (
        <div>
          <h1>Reviews</h1>
        </div>
      )}
    </Container>
  );
};

export default ReviewsRoutePage;
