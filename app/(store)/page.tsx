import Billboards from "@/components/store/components/shop/home/billboards";
import ProductBrands from "@/components/store/components/shop/home/brands";
import Categories from "@/components/store/components/shop/home/categories";
import Featured from "@/components/store/components/shop/home/featured";
import Features from "@/components/store/components/shop/home/features";
import Hero from "@/components/store/components/shop/home/hero";
import Memberships from "@/components/store/components/shop/home/membership";
import PaymentBrands from "@/components/store/components/shop/home/payment";
import React from "react";

const StoreRoutePage = () => {
  return (
    <div className="space-y-40 mb-40 overflow-hidden">
      {" "}
      <Hero />
      <Billboards />
      <Featured />
      <Categories />
      <ProductBrands />
      <Features />
      <Memberships />
      <PaymentBrands />
    </div>
  );
};

export default StoreRoutePage;
