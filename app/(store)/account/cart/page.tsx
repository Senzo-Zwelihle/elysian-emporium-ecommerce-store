import { redirect } from "next/navigation";
import React from "react";
import CartClient from "@/components/store/components/cart/cart-client";
import { Container } from "@/components/ui/container";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ShoppingCart } from "@/types/store/shopping-cart";
import { redis } from "@/redis/cart/cart-db";

const CartRoutePage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  // Fetch cart from Redis
  const cart: ShoppingCart | null = await redis.get(`cart-${user.id}`);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} id="cart">
      <CartClient items={cart?.items || []} userId={user.id} />
    </Container>
  );
};

export default CartRoutePage;
