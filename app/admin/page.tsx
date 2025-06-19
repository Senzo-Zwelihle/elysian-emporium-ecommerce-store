import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import {
  BoxesIcon,
  CopyrightIcon,
  FileTextIcon,
  HandCoinsIcon,
  ImageIcon,
  NotebookTextIcon,
  ShoppingBagIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
import {
  fetchTotalUsers,
  fetchNewUsersToday,
  fetchTotalStores,
  fetchNewStoresToday,
  fetchTotalProducts,
  fetchOutOfStockProducts,
  fetchTotalOrders,
  fetchNewOrdersToday,
  fetchTotalRevenue,
  fetchRevenueToday,
  fetchSalesDataLast30Days,
  fetchProductStockData,
  fetchUserRegistrationDataLast12Months,
  fetchLatestUsers,
  fetchLatestOrders,
  fetchLatestProducts,
  fetchTotalBrands,
  fetchActiveBrands,
  fetchLatestBrands,
  fetchTotalBillboards,
  fetchActiveBillboards,
  fetchLatestBillboards,
  fetchTotalCollections,
  fetchActiveCollections,
  fetchLatestCollections,
  fetchTotalDocuments,
  fetchPublishedDocuments,
  fetchLatestDocuments,
  fetchTotalNotes,
  fetchPublishedNotes,
  fetchLatestNotes,
  fetchLatestStores,
} from "@/server/actions/admin/admin-dashboard";
import AdminDashboardCard from "@/components/admin/components/admin/card/admin-dashboard-card";
import AdminDashboardChartsTab from "@/components/admin/components/admin/chart/admin-dashboard-charts";
import UsersTab from "@/components/admin/components/admin/tab/user";
import ProductsTab from "@/components/admin/components/admin/tab/product";
import OrdersTab from "@/components/admin/components/admin/tab/order";
import BrandsTab from "@/components/admin/components/admin/tab/brand";
import BillboardsTab from "@/components/admin/components/admin/tab/billboard";
import CollectionsTab from "@/components/admin/components/admin/tab/collection";
import DocumentsTab from "@/components/admin/components/admin/tab/document";
import NotesTab from "@/components/admin/components/admin/tab/note";
import StoresTab from "@/components/admin/components/admin/tab/store";

const AdminDashboardRoutePage = async () => {
  noStore();

  const [
    totalUsers,
    totalStores,
    newStoresToday,
    newUsersToday,
    totalProducts,
    outOfStockProducts,
    totalOrders,
    newOrdersToday,
    totalRevenue,
    revenueToday,
    salesData,
    productStockData,
    userRegistrationData,
    latestUsers,
    latestStores,
    latestOrders,
    latestProducts,
    totalBrands,
    activeBrands,
    latestBrands,
    totalBillboards,
    activeBillboards,
    latestBillboards,
    totalCollections,
    activeCollections,
    latestCollections,
    totalDocuments,
    publishedDocuments,
    latestDocuments,
    totalNotes,
    publishedNotes,
    latestNotes,
  ] = await Promise.all([
    fetchTotalUsers(),
    fetchNewUsersToday(),
    fetchTotalStores(),
    fetchNewStoresToday(),
    fetchTotalProducts(),
    fetchOutOfStockProducts(),
    fetchTotalOrders(),
    fetchNewOrdersToday(),
    fetchTotalRevenue(),
    fetchRevenueToday(),
    fetchSalesDataLast30Days(),
    fetchProductStockData(),
    fetchUserRegistrationDataLast12Months(),
    fetchLatestUsers(10),
    fetchLatestStores(10),
    fetchLatestOrders(10),
    fetchLatestProducts(10),
    fetchTotalBrands(),
    fetchActiveBrands(),
    fetchLatestBrands(10),
    fetchTotalBillboards(),
    fetchActiveBillboards(),
    fetchLatestBillboards(10),
    fetchTotalCollections(),
    fetchActiveCollections(),
    fetchLatestCollections(10),
    fetchTotalDocuments(),
    fetchPublishedDocuments(),
    fetchLatestDocuments(10),
    fetchTotalNotes(),
    fetchPublishedNotes(),
    fetchLatestNotes(10),
  ]);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <AdminDashboardCard
          title="Total Revenue"
          value={`R ${totalRevenue.toFixed(2).toLocaleString()}`}
          description={`+ R ${revenueToday.toFixed(2).toLocaleString()} today`}
          icon={<HandCoinsIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          description={`+${newOrdersToday} new orders today`}
          icon={<ShoppingBagIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          description={`+${newUsersToday} new users today`}
          icon={<UsersIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          description={`${outOfStockProducts} out of stock`}
          icon={<BoxesIcon className=" text-muted-foreground" />}
        />
        {/* New Overview Cards */}
        <AdminDashboardCard
          title="Total Brands"
          value={totalBrands.toLocaleString()}
          description={`${activeBrands} active brands`}
          icon={<CopyrightIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Billboards"
          value={totalBillboards.toLocaleString()}
          description={`${activeBillboards} active billboards`}
          icon={<ImageIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Collections"
          value={totalCollections.toLocaleString()}
          description={`${activeCollections} active collections`}
          icon={<BoxesIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Documents"
          value={totalDocuments.toLocaleString()}
          description={`${publishedDocuments} published documents`}
          icon={<FileTextIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Notes"
          value={totalNotes.toLocaleString()}
          description={`${publishedNotes} published notes`}
          icon={<NotebookTextIcon className=" text-muted-foreground" />}
        />
        <AdminDashboardCard
          title="Total Stores"
          value={totalStores.toLocaleString()}
          description={`+${newStoresToday} new stores today`}
          icon={<StoreIcon className=" text-muted-foreground" />}
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-9 xl:grid-cols-10">
          {" "}
          {/* Adjust grid-cols as needed for responsiveness */}
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="billboards">Billboards</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminDashboardChartsTab
            salesData={salesData}
            productStockData={productStockData}
            userRegistrationData={userRegistrationData}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersTab users={latestUsers} />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsTab products={latestProducts} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrdersTab orders={latestOrders} />
        </TabsContent>

        <TabsContent value="brands" className="space-y-4">
          <BrandsTab brands={latestBrands} />
        </TabsContent>

        <TabsContent value="billboards" className="space-y-4">
          <BillboardsTab billboards={latestBillboards} />
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <CollectionsTab collections={latestCollections} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentsTab documents={latestDocuments} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <NotesTab notes={latestNotes} />
        </TabsContent>

        <TabsContent value="stores" className="space-y-4">
          <StoresTab stores={latestStores} />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default AdminDashboardRoutePage;
