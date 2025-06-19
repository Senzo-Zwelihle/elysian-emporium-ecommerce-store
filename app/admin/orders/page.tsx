"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SortingState, Updater } from "@tanstack/react-table";
import { OrderStatus, PaymentStatus } from "@/lib/generated/prisma";
import { getAdminOrdersAction } from "@/server/actions/admin/order";
import { Container } from "@/components/ui/container";
import {
  columns,
  mapOrderToOrderColumn,
  OrderColumn,
  OrderWithRelations,
} from "@/components/admin/components/admin/order/order-columns";
import { DataTable } from "@/components/admin/components/admin/order/order-data-table";

const OrdersRoutePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPageIndex = Number(searchParams.get("page") || "1") - 1;
  const initialPageSize = Number(searchParams.get("perPage") || "10");
  const initialGlobalFilter = searchParams.get("search") || "";
  const initialStatusFilter = searchParams.get("status") || "";
  const initialPaymentStatusFilter = searchParams.get("paymentStatus") || "";
  const initialSortBy = (searchParams.get("sortBy") || "createdAt") as
    | "createdAt"
    | "totalAmount";
  const initialSortOrder = (searchParams.get("sortOrder") || "desc") as
    | "asc"
    | "desc";

  const [pageIndex, setPageIndex] = React.useState(initialPageIndex);
  const [pageSize, setPageSize] = React.useState(initialPageSize); 
  const [globalFilter, setGlobalFilter] = React.useState(initialGlobalFilter);
  const [statusFilter, setStatusFilter] =
    React.useState<string>(initialStatusFilter);
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState<string>(
    initialPaymentStatusFilter
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: initialSortBy, desc: initialSortOrder === "desc" },
  ]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "adminOrders",
      pageIndex,
      pageSize,
      globalFilter,
      statusFilter,
      paymentStatusFilter,
      sorting,
    ],
    queryFn: async () => {
      const params = {
        page: pageIndex + 1,
        perPage: pageSize,
        search: globalFilter || undefined,
        status: statusFilter ? (statusFilter as OrderStatus) : undefined,
        paymentStatus: paymentStatusFilter
          ? (paymentStatusFilter as PaymentStatus)
          : undefined,
        sortBy: (sorting[0]?.id as "createdAt" | "totalAmount") || "createdAt",
        sortOrder: (sorting[0]?.desc ? "desc" : "asc") as "asc" | "desc",
      };

      const result = await getAdminOrdersAction(params);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch orders.");
      }

      const mappedOrders: OrderColumn[] = (
        result.orders as OrderWithRelations[]
      ).map(mapOrderToOrderColumn);

      return {
        orders: mappedOrders,
        totalOrders: result.totalOrders!,
        page: result.page!,
        perPage: result.perPage!,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to load orders.");
    }
  }, [isError, error]);

  const handlePaginationChange = React.useCallback(
    ({
      pageIndex: newPageIndex,
      pageSize: newPageSize,
    }: {
      pageIndex: number;
      pageSize: number;
    }) => {
      setPageIndex(newPageIndex);
      setPageSize(newPageSize);
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("page", String(newPageIndex + 1));
      current.set("perPage", String(newPageSize));
      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  const handleGlobalFilterChange = React.useCallback(
    (value: string) => {
      setGlobalFilter(value);
      setPageIndex(0);
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        current.set("search", value);
      } else {
        current.delete("search");
      }
      current.set("page", "1");
      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  const handleFilterChange = React.useCallback(
    (columnId: string, value: string) => {
      if (columnId === "status") {
        setStatusFilter(value);
      } else if (columnId === "paymentStatus") {
        setPaymentStatusFilter(value);
      }
      setPageIndex(0);
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        current.set(columnId, value);
      } else {
        current.delete(columnId);
      }
      current.set("page", "1");
      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  const handleSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSortingState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;
      setSorting(newSortingState);
      setPageIndex(0);

      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newSortingState.length > 0) {
        current.set("sortBy", newSortingState[0].id);
        current.set("sortOrder", newSortingState[0].desc ? "desc" : "asc");
      } else {
        current.delete("sortBy");
        current.delete("sortOrder");
      }
      current.set("page", "1");
      router.push(`?${current.toString()}`);
    },
    [router, searchParams, sorting]
  );

  const orderStatusOptions = Object.values(OrderStatus).map((status) => ({
    label: status.replace(/([A-Z])/g, " $1").trim(),
    value: status,
  }));

  const paymentStatusOptions = Object.values(PaymentStatus).map((status) => ({
    label: status.replace(/([A-Z])/g, " $1").trim(),
    value: status,
  }));

  const filterableOptions = [
    {
      id: "status",
      title: "Order Status",
      options: orderStatusOptions,
    },
    {
      id: "paymentStatus",
      title: "Payment Status",
      options: paymentStatusOptions,
    },
  ];
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <DataTable
        columns={columns}
        data={data?.orders || []}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={data?.totalOrders || 0}
        onPaginationChange={handlePaginationChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        filterableOptions={filterableOptions}
        onFilterChange={handleFilterChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default OrdersRoutePage;
