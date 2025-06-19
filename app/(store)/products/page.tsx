import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { serializeProducts } from "@/types/store/product";
import { fetchAllBrands, fetchAllCategories, fetchAllTags, fetchProducts } from "@/server/actions/store/filter";
import ProductContainer from "@/components/store/components/product/product-container";
import { ProductFilterSidebar } from "@/components/store/components/filter/filter-sidebar";



interface ProductsPageProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const ProductsRoutePage = async ({ searchParams }: ProductsPageProps) => {
  // Await the searchParams Promise to get the actual search parameters
  const resolvedSearchParams = (await searchParams) || {};

  // Safely parse numbers, handling potential string[] or undefined
  const parsedMinPrice =
    typeof resolvedSearchParams.minPrice === "string"
      ? parseFloat(resolvedSearchParams.minPrice)
      : undefined;
  const parsedMaxPrice =
    typeof resolvedSearchParams.maxPrice === "string"
      ? parseFloat(resolvedSearchParams.maxPrice)
      : undefined;

  // Fetch all necessary data in parallel
  const [rawProducts, availableCategories, availableTags, availableBrands] =
    await Promise.all([
      fetchProducts({
        search: resolvedSearchParams.search as string | undefined,
        category: resolvedSearchParams.category as string | undefined,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        sortBy: resolvedSearchParams.sortBy as string | undefined,
        tag: resolvedSearchParams.tag as string | undefined,
        brand: resolvedSearchParams.brand as string | undefined,
      }),
      fetchAllCategories(),
      fetchAllTags(),
      fetchAllBrands(),
    ]);

  const products = serializeProducts(rawProducts);

  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <Heading
        size={"md"}
        font={"PolySansBulky"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        All Products
      </Heading>
      <div className="flex flex-col md:flex-row gap-6">
      <ProductFilterSidebar
        resolvedSearchParams={resolvedSearchParams}
        availableCategories={availableCategories}
        availableBrands={availableBrands}
        availableTags={availableTags}
        maxAllowedPrice={200000} 
      />
      <main className="md:w-3/4">
        <ProductContainer initialProducts={products} />
      </main>
    </div>
    </Container>
  );
};

export default ProductsRoutePage;