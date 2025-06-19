import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import {
  fetchUserAddresses,
  fetchUserFavorites,
  fetchUserOrders,
  fetchUserProfile,
  fetchUserReviews,
  getCurrentUserId,
} from "@/server/actions/account/account";
import {
  AddressData,
  FavoriteData,
  OrderData,
  ReviewData,
  UserProfileData,
} from "@/interfaces/store/account";
import AccountClient from "@/components/store/components/account/account-client";

const AccountRoutePage = async () => {
  noStore();

  const userId = await getCurrentUserId();
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <h1 className="text-2xl ">
          No user found. Please ensure you are logged in.
        </h1>
      </div>
    );
  }

  //   fetch user details
  const [user, addresses, orders, favorites, reviews] = await Promise.all([
    fetchUserProfile(userId),
    fetchUserAddresses(userId),
    fetchUserOrders(userId),
    fetchUserFavorites(userId),
    fetchUserReviews(userId),
  ]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl ">User profile not found.</h1>
      </div>
    );
  }

  //   types
  const clientUser: UserProfileData = {
    ...user,
    // phoneNumber property removed because it does not exist on user
  };
  // profile addresses
  const clientAddresses: AddressData[] = addresses.map((addr) => ({
    ...addr,
  }));

  //   orders
  const clientOrders: OrderData[] = orders.map((order) => ({
    ...order,
    totalAmount: parseFloat(order.totalAmount.toString()),
    shippingCost: parseFloat(order.shippingCost.toString()),
    vatAmount: parseFloat(order.vatAmount.toString()),

    items: order.items.map((item) => ({
      ...item,
      price: parseFloat(item.price.toString()),
      product: {
        ...item.product,
        price: parseFloat(item.product.price.toString()),
      },
    })),
  }));

  //   favorites
  const clientFavorites: FavoriteData[] = favorites.map((fav) => ({
    ...fav,
    product: {
      ...fav.product,
      price: parseFloat(fav.product.price.toString()),
    },
  }));

  //   reviews
  const clientReviews: ReviewData[] = reviews.map((rev) => ({
    ...rev,
    rating: rev.rating,
    product: {
      id: rev.product.id,
      name: rev.product.name,
      images: rev.product.images,
      price: parseFloat(rev.product.price.toString()),
      stock: rev.product.stock,
    },
  }));
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <AccountClient
        user={clientUser}
        addresses={clientAddresses}
        orders={clientOrders}
        favorites={clientFavorites}
        reviews={clientReviews}
      />
    </Container>
  );
};

export default AccountRoutePage;
