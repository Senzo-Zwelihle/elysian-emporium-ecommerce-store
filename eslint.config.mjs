import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
  {
    ignores: [
      "lib/generated/**",
      "components/core/animated-group.tsx",
      "components/core/text-effect.tsx",
      "components/core/carousel.tsx",
      "components/core/sparkles.tsx",
      "components/store/components/cart/cart-item-list.tsx",
      "components/store/components/product/product-container.tsx",
      "components/admin/components/admin/order/order-columns.tsx",
    ],
  },
];

export default eslintConfig;
