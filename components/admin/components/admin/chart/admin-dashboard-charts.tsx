import React from "react";
import { DashboardChartsTabProps } from "@/types/admin/admin-dashboard";
import SalesChart from "@/components/admin/components/admin/chart/total-sales-chart";
import ProductStockChart from "@/components/admin/components/admin/chart/product-stock-chart";
import UserRegistrationChart from "@/components/admin/components/admin/chart/user-registration-chart";

const AdminDashboardChartsTab = ({
  salesData,
  productStockData,
  userRegistrationData,
}: DashboardChartsTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2">
        <SalesChart data={salesData} />
      </div>
      <div className="md:col-span-1">
        <ProductStockChart data={productStockData} />
      </div>
      <div className="md:col-span-3">
        <UserRegistrationChart data={userRegistrationData} />
      </div>
    </div>
  );
};

export default AdminDashboardChartsTab;
