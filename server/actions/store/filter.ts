import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/client/prisma";
import { ProductFilterParams, ProductServer } from "@/types/store/product";
import { Category, ProductTag } from "@/lib/generated/prisma";



export async function fetchProducts(
  params: ProductFilterParams,
): Promise<ProductServer[]> {
  noStore();

  const { search, category, minPrice, maxPrice, sortBy, tag, brand } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  if (tag) {
    where.tag = tag;
  }

  if (brand) {
    where.brand = brand;
  }

  let orderBy: any = { createdAt: "desc" };

  if (sortBy) {
    switch (sortBy) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
        break;
    }
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      brand: true,
      price: true,
      stock: true,
      productVariant: true,
      productVariantValue: true,
      description: true,
      category: true,
      features: true,
      specifications: true,
      content: true,
      images: true,
      tag: true,
      status: true,
      createdAt: true,
      updatedAt: true,
        swatch: {
        select: {
          id: true,
          productId: true,
          type: true,
          name: true,
          value: true,
          images: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      review: {
        select: {
          rating: true,
        },
      },
      favorites: true,
    },
    orderBy,
  });
  return products;
}

export async function fetchAllCategories(): Promise<Category[]> {
  return Object.values(Category);
}

export async function fetchAllTags(): Promise<ProductTag[]> {
  // Similar to categories, get all enum values.
  return Object.values(ProductTag);
}

export async function fetchAllBrands(): Promise<string[]> {
  noStore();
  const brands = await prisma.brand.findMany({
    select: {
      company: true,
    },
    where: {
      active: true, // Only show active brands
    },
    orderBy: {
      company: "asc",
    },
  });
  return brands.map((brand) => brand.company);
}