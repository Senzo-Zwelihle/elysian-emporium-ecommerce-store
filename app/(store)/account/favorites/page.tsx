import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/client/prisma";
import { FavoritesPageWrapper } from "@/components/store/components/favorite/favorite-wrapper";
import FavoritesEmptyState from "@/components/store/components/favorite/favorite-empty-state";
import { FavoritesList } from "@/components/store/components/favorite/favorite-list";
import { Container } from "@/components/ui/container";
import { FavoriteItemForClient } from "@/interfaces/store/favorite";

export default async function FavoritesPage() {
  noStore();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      productId: true,
      name: true,
      product: {
        select: {
          price: true,
          images: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const favoritedItemsForClient: FavoriteItemForClient[] = favorites.map(
    (fav) => ({
      id: fav.id,
      productId: fav.productId,
      name: fav.name,
      price: fav.product?.price?.toNumber() || 0,
      images: fav.product?.images?.[0] || "/placeholder.jpg",
      slug: fav.product?.slug || "unknown-product",
    })
  );

  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <FavoritesPageWrapper>
        {favoritedItemsForClient.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-y-6">
              <FavoritesList items={favoritedItemsForClient} />
            </div>
          </div>
        )}
      </FavoritesPageWrapper>
    </Container>
  );
}
