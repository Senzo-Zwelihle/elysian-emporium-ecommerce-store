import { Decimal } from "../generated/prisma/runtime/library";

// Southa local currency
export function formatPrice(price: string | Decimal | number) {
  const numericPrice =
    typeof price === "string" ? parseFloat(price) : Number(price);
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(numericPrice);
}