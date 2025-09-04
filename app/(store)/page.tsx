import React from "react";
import Billboards from "@/components/store/home/billboards";
import Collections from "@/components/store/home/collections";
import Promotions from "@/components/store/home/promotions";
import FeaturedProducts from "@/components/store/home/featured-products";



const Store = () => {
  return (
    <div className="space-y-40 mb-40 overflow-hidden">
      {/* <Hero /> */}
      <Billboards />
      <Collections />
      <Promotions />
      <FeaturedProducts />
      
    </div>
  );
};

export default Store;

// TODO: CLean up project
// TODO: Create search drawer component
// TODO: Unit tests
