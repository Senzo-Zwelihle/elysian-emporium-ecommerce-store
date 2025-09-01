import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma/client";

export async function fetchAllDocuments() {
  noStore();
  const data = await prisma.document.findMany({
    select: {
      id: true,
      userId: true,
      user: true,
      name: true,
      documentType: true,
      status: true,
      file: true,
      starred: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}
