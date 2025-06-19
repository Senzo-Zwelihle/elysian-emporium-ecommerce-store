import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/client/prisma";

export async function fetchTotalUsers() {
  noStore();
  const totalUsers = await prisma.user.count();
  return totalUsers;
}

export async function fetchNewUsersToday() {
  noStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const newUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
  return newUsers;
}

export async function fetchTotalStores() {
  noStore();
  const totalStores = await prisma.store.count();
  return totalStores;
}
export async function fetchNewStoresToday() {
  noStore();
  const today = new Date();
  // Start of today
  today.setHours(0, 0, 0, 0);
  const newStores = await prisma.store.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
  return newStores;
}

export async function fetchTotalProducts() {
  noStore();
  const totalProducts = await prisma.product.count();
  return totalProducts;
}

export async function fetchOutOfStockProducts() {
  noStore();
  const outOfStockProducts = await prisma.product.count({
    where: {
      stock: {
        lte: 0, // Less than or equal to 0 for out of stock
      },
    },
  });
  return outOfStockProducts;
}

export async function fetchTotalOrders() {
  noStore();
  const totalOrders = await prisma.order.count();
  return totalOrders;
}

export async function fetchNewOrdersToday() {
  noStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const newOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });
  return newOrders;
}

export async function fetchTotalRevenue() {
  noStore();
  const totalRevenueResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentStatus: "Paid",
    },
  });
  // Ensure totalAmount is a number, default to 0 if null
  return totalRevenueResult._sum.totalAmount?.toNumber() || 0;
}

export async function fetchRevenueToday() {
  noStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const revenueTodayResult = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentStatus: "Paid",
      createdAt: {
        gte: today,
      },
    },
  });
  return revenueTodayResult._sum.totalAmount?.toNumber() || 0;
}

// --- Chart Data ---

export async function fetchSalesDataLast30Days() {
  noStore();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const salesData = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: {
      totalAmount: true,
    },
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
      paymentStatus: "Paid",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Aggregate by day, handling potential multiple orders on the same day
  const dailySales: { date: string; totalAmount: number }[] = [];
  const salesMap = new Map<string, number>();

  salesData.forEach((item) => {
    const date = item.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
    const amount = item._sum.totalAmount?.toNumber() || 0;
    salesMap.set(date, (salesMap.get(date) || 0) + amount);
  });

  // Fill in missing days with 0 sales for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0];

    dailySales.push({
      date: formattedDate,
      totalAmount: salesMap.get(formattedDate) || 0,
    });
  }

  return dailySales;
}

export async function fetchProductStockData() {
  noStore();
  const inStock = await prisma.product.count({
    where: {
      stock: {
        gt: 0,
      },
    },
  });

  const outOfStock = await prisma.product.count({
    where: {
      stock: {
        lte: 0,
      },
    },
  });

  return [
    { name: "In Stock", value: inStock, fill: "var(--color-in-stock)" },
    {
      name: "Out of Stock",
      value: outOfStock,
      fill: "var(--color-out-of-stock)",
    },
  ];
}

export async function fetchUserRegistrationDataLast12Months() {
  noStore();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); // Go back 11 months for a full 12-month range
  twelveMonthsAgo.setDate(1); // Start of the month
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const userData = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: twelveMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const monthlyRegistrations: { month: string; users: number }[] = [];
  const registrationMap = new Map<string, number>(); // key: YYYY-MM

  userData.forEach((item) => {
    const month = item.createdAt.toISOString().substring(0, 7); // YYYY-MM
    const count = item._count.id;
    registrationMap.set(month, (registrationMap.get(month) || 0) + count);
  });

  // Fill in missing months with 0 registrations for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(twelveMonthsAgo);
    date.setMonth(twelveMonthsAgo.getMonth() + i);
    const formattedMonth = date.toISOString().substring(0, 7); // YYYY-MM
    const monthName = date.toLocaleString("en-US", {
      month: "short",
      year: "2-digit",
    });

    monthlyRegistrations.push({
      month: monthName,
      users: registrationMap.get(formattedMonth) || 0,
    });
  }

  return monthlyRegistrations;
}

// --- Recent Activity Tables

export async function fetchLatestUsers(limit: number = 5) {
  noStore();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return users;
}

export async function fetchLatestStores(limit: number = 5) {
  noStore();
  const stores = await prisma.store.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      location: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return stores;
}

export async function fetchLatestOrders(limit: number = 5) {
  noStore();
  const latestOrders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestOrders;
}

export async function fetchLatestProducts(limit: number = 5) {
  noStore();
  const latestProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestProducts;
}

// --- Brand Data ---
export async function fetchTotalBrands() {
  noStore();
  const totalBrands = await prisma.brand.count();
  return totalBrands;
}

export async function fetchActiveBrands() {
  noStore();
  const activeBrands = await prisma.brand.count({
    where: {
      active: true,
    },
  });
  return activeBrands;
}

export async function fetchLatestBrands(limit: number = 5) {
  noStore();
  const latestBrands = await prisma.brand.findMany({
    select: {
      id: true,
      company: true,
      logo: true,
      active: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestBrands;
}

// --- Billboard Data ---
export async function fetchTotalBillboards() {
  noStore();
  const totalBillboards = await prisma.billboard.count();
  return totalBillboards;
}

export async function fetchActiveBillboards() {
  noStore();
  const activeBillboards = await prisma.billboard.count({
    where: {
      state: "Active",
    },
  });
  return activeBillboards;
}

export async function fetchLatestBillboards(limit: number = 5) {
  noStore();
  const latestBillboards = await prisma.billboard.findMany({
    select: {
      id: true,
      label: true,
      image: true,
      state: true,
      category: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestBillboards;
}

// --- Collection Data ---
export async function fetchTotalCollections() {
  noStore();
  const totalCollections = await prisma.collection.count();
  return totalCollections;
}

export async function fetchActiveCollections() {
  noStore();
  const activeCollections = await prisma.collection.count({
    where: {
      state: "Active",
    },
  });
  return activeCollections;
}

export async function fetchLatestCollections(limit: number = 5) {
  noStore();
  const latestCollections = await prisma.collection.findMany({
    select: {
      id: true,
      label: true,
      image: true,
      state: true,
      category: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestCollections;
}

// --- Document Data ---
export async function fetchTotalDocuments() {
  noStore();
  const totalDocuments = await prisma.document.count();
  return totalDocuments;
}

export async function fetchPublishedDocuments() {
  noStore();
  const publishedDocuments = await prisma.document.count({
    where: {
      published: true,
    },
  });
  return publishedDocuments;
}

export async function fetchLatestDocuments(limit: number = 5) {
  noStore();
  const latestDocuments = await prisma.document.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      state: true,
      published: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestDocuments;
}

// --- Note Data ---
export async function fetchTotalNotes() {
  noStore();
  const totalNotes = await prisma.note.count();
  return totalNotes;
}

export async function fetchPublishedNotes() {
  noStore();
  const publishedNotes = await prisma.note.count({
    where: {
      published: true,
    },
  });
  return publishedNotes;
}

export async function fetchLatestNotes(limit: number = 5) {
  noStore();
  const latestNotes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      tag: true,
      status: true,
      published: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return latestNotes;
}
