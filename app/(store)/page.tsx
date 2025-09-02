import React from "react";
import Hero from "@/components/store/home/hero";
import Billboards from "@/components/store/home/billboards";

const Store = () => {
  return (
    <div className="space-y-40 mb-40 overflow-hidden">
      {/* <Hero /> */}
      <Billboards/>
    </div>
  );
};

export default Store;
