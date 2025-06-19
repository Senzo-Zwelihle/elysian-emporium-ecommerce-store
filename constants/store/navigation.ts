export const navigationMenu = [
  {
    label: "Home",
    target: "/",
  },
  {
    label: "Featured",
    target: "#featured",
  },
  {
    label: "Shop All",
    target: "/products",
  },
  {
    label: "Profile",
    target: "/account",
  },
  {
    label: "Orders",
    target: "/account/orders",
  },
  {
    label: "Addresses",
    target: "/account/addresses",
  },
  {
    label: "Faq's",
    target: "#faqs",
  },
];

export const navigationMenuItems = [
  {
    label: "Home",
    target: "/",
  },
  {
    label: "Featured",
    target: "#featured",
  },
  {
    label: "Products",
    target: "/products",
  },
  {
    label: "Profile",
    target: "/account",
    children: [
      { label: "Account", target: "/account" },
      { label: "Addresses", target: "/account/addresses" },
      { label: "Settings", target: "/account" },
    ],
  },
  { label: "Orders", target: "/account/orders" },
  {
    label: "Faq's",
    target: "#faqs",
  },
];

export const footerMenuItems = [
  {
    label: "Home",
    target: "/",
  },
  {
    label: "Featured",
    target: "#featured",
  },
  {
    label: "Products",
    target: "/products",
  },
  {
    label: "Account",
    target: "/account",
  },
  {
    label: "Orders",
    target: "/account/orders",
  },
  {
    label: "Faq's",
    target: "#faqs",
  },
];
