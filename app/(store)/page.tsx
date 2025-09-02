import React from "react";
import Hero from "@/components/store/home/hero";
import Billboards from "@/components/store/home/billboards";
import Collections from "@/components/store/home/collections";
import Promotions from "@/components/store/home/promotions";

const Store = () => {
  return (
    <div className="space-y-40 mb-40 overflow-hidden">
      {/* <Hero /> */}
      <Billboards/>
      <Collections/>
      <Promotions/>
    </div>
  );
};

export default Store;
