"use client";

import { cx } from "@/lib/cx";
import type { SVGProps } from "react";


type IllustrationType = "text" | "cloud" | "shopping" | "electronics" | "clothing" | "books" | "home" | "sports" | "beauty" | "toys" | "automotive";
type IllustrationSize = "sm" | "md" | "lg";

interface IllustrationProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  type: IllustrationType;
  size?: IllustrationSize;
}

const getSizeProps = (size: IllustrationSize) => {
  switch (size) {
    case "sm":
      return { width: "64", height: "64" };
    case "md":
      return { width: "96", height: "96" };
    case "lg":
      return { width: "128", height: "128" };
    default:
      return { width: "96", height: "96" };
  }
};

const ShoppingIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M40 50h48l-4 28H44l-4-28z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="50" cy="90" r="4" fill="currentColor" />
    <circle cx="78" cy="90" r="4" fill="currentColor" />
    <path d="M40 50L36 30H20" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ElectronicsIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <rect x="20" y="30" width="88" height="60" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="30" y="40" width="68" height="40" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="64" cy="100" r="4" fill="currentColor" />
    <path d="M50 100h28" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ClothingIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <path d="M40 30h48v20l-8 8v50H48V58l-8-8V30z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M48 30v-8a8 8 0 0116 0v8" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const BooksIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <rect x="30" y="20" width="68" height="88" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M40 30h48M40 40h48M40 50h48M40 60h32" stroke="currentColor" strokeWidth="2" />
    <path d="M64 20v88" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const HomeIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <path d="M20 70L64 30l44 40v38H20V70z" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="50" y="80" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="85" y="50" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const SportsIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M30 64h68M64 30v68" stroke="currentColor" strokeWidth="2" />
    <path d="M44 44l40 40M84 44L44 84" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const BeautyIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <rect x="50" y="30" width="28" height="60" rx="14" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="64" cy="25" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M58 100h12l2 8H56l2-8z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const ToysIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <circle cx="64" cy="50" r="25" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="54" cy="45" r="3" fill="currentColor" />
    <circle cx="74" cy="45" r="3" fill="currentColor" />
    <path d="M58 58a8 8 0 0012 0" stroke="currentColor" strokeWidth="2" />
    <rect x="40" y="75" width="48" height="30" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const AutomotiveIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <path d="M20 80h88l-8-30H28l-8 30z" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="40" cy="90" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="88" cy="90" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="35" y="60" width="20" height="15" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="73" y="60" width="20" height="15" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const CloudIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 128 128" fill="none" {...props}>
    <path d="M30 80a20 20 0 0120-20 25 25 0 0150 0 15 15 0 010 30H40a10 10 0 01-10-10z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const Illustration = ({ type, size = "md", className, ...props }: IllustrationProps) => {
  const sizeProps = getSizeProps(size);
  const commonProps = {
    ...sizeProps,
    ...props,
    className: cx("text-primary", className)
  };

  switch (type) {
    case "text":
      return <TextIllustration {...commonProps} />;
    case "cloud":
      return <CloudIllustration {...commonProps} />;
    case "shopping":
      return <ShoppingIllustration {...commonProps} />;
    case "electronics":
      return <ElectronicsIllustration {...commonProps} />;
    case "clothing":
      return <ClothingIllustration {...commonProps} />;
    case "books":
      return <BooksIllustration {...commonProps} />;
    case "home":
      return <HomeIllustration {...commonProps} />;
    case "sports":
      return <SportsIllustration {...commonProps} />;
    case "beauty":
      return <BeautyIllustration {...commonProps} />;
    case "toys":
      return <ToysIllustration {...commonProps} />;
    case "automotive":
      return <AutomotiveIllustration {...commonProps} />;
    default:
      return <ShoppingIllustration {...commonProps} />;
  }
};

export const TextIllustration = (props: SVGProps<SVGSVGElement>) => (
    <svg width="514" height="164" viewBox="0 0 514 164" fill="none" {...props} className={cx("text-fg-quaternary", props.className)}>
        <circle cx="101" cy="22" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="101" cy="142" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="21" cy="102" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="141" cy="102" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="193" cy="82" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="313" cy="82" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="253" cy="22" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="253" cy="142" r="20" stroke="currentColor" strokeWidth="2" />
        <path
            d="M1 102C1 90.9543 9.9543 82 21 82H141C152.046 82 161 90.9543 161 102C161 113.046 152.046 122 141 122H21C9.9543 122 1 113.046 1 102Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M101 162C89.9543 162 81 153.046 81 142L81 22C81 10.9543 89.9543 2 101 2C112.046 2 121 10.9543 121 22L121 142C121 153.046 112.046 162 101 162Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M7.14214 115.995C-0.668351 108.185 -0.668351 95.5214 7.14214 87.7109L86.7107 8.14235C94.5212 0.331858 107.184 0.331851 114.995 8.14234C122.805 15.9528 122.805 28.6161 114.995 36.4266L35.4264 115.995C27.6159 123.806 14.9526 123.806 7.14214 115.995Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <circle cx="453" cy="22" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="453" cy="142" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="373" cy="102" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="493" cy="102" r="20" stroke="currentColor" strokeWidth="2" />
        <path
            d="M353 102C353 90.9543 361.954 82 373 82H493C504.046 82 513 90.9543 513 102C513 113.046 504.046 122 493 122H373C361.954 122 353 113.046 353 102Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M453 162C441.954 162 433 153.046 433 142L433 22C433 10.9543 441.954 2 453 2C464.046 2 473 10.9543 473 22L473 142C473 153.046 464.046 162 453 162Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M359.142 115.995C351.332 108.185 351.332 95.5214 359.142 87.7109L438.711 8.14235C446.521 0.331858 459.184 0.331851 466.995 8.14234C474.805 15.9528 474.805 28.6161 466.995 36.4266L387.426 115.995C379.616 123.806 366.953 123.806 359.142 115.995Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <circle cx="253" cy="82" r="80" stroke="currentColor" strokeWidth="2" />
        <circle cx="253" cy="82" r="40" stroke="currentColor" strokeWidth="2" />
        <line x1="8.74228e-08" y1="1" x2="513" y2="1.00004" stroke="currentColor" strokeWidth="2" />
        <line x1="-8.74228e-08" y1="163" x2="513" y2="163" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const TextIllustrationSM = (props: SVGProps<SVGSVGElement>) => (
    <svg width="282" height="91" viewBox="0 0 282 91" fill="none" {...props} className={cx("text-bg-tertiary", props.className)}>
        <circle cx="56.0197" cy="12.9843" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="56.0197" cy="78.3544" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="12.4399" cy="56.5639" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="77.8092" cy="56.5639" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="106.136" cy="45.6694" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="171.506" cy="45.6694" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="138.821" cy="12.9843" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="138.821" cy="78.3544" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <path
            d="M1.54492 56.5639C1.54492 50.5468 6.42275 45.6689 12.4399 45.6689H77.8095C83.8266 45.6689 88.7045 50.5468 88.7045 56.5639C88.7045 62.581 83.8266 67.4588 77.8095 67.4588H12.4399C6.42275 67.4588 1.54492 62.581 1.54492 56.5639Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M56.0197 89.249C50.0026 89.249 45.1248 84.3712 45.1248 78.3541L45.1248 12.9844C45.1248 6.96732 50.0026 2.08948 56.0197 2.08948C62.0368 2.08948 66.9146 6.96731 66.9146 12.9844L66.9146 78.3541C66.9146 84.3712 62.0368 89.249 56.0197 89.249Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M4.89041 64.1883C0.635671 59.9335 0.635671 53.0352 4.89041 48.7805L48.2351 5.43576C52.4899 1.18102 59.3882 1.18101 63.6429 5.43575C67.8977 9.69049 67.8977 16.5888 63.6429 20.8435L20.2982 64.1883C16.0434 68.443 9.14515 68.443 4.89041 64.1883Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <circle cx="247.77" cy="12.9843" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="247.77" cy="78.3544" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="204.191" cy="56.5639" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <circle cx="269.56" cy="56.5639" r="10.8949" stroke="currentColor" strokeWidth="2" />
        <path
            d="M193.296 56.5639C193.296 50.5468 198.174 45.6689 204.191 45.6689H269.56C275.578 45.6689 280.455 50.5468 280.455 56.5639C280.455 62.581 275.578 67.4588 269.56 67.4588H204.191C198.174 67.4588 193.296 62.581 193.296 56.5639Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M247.77 89.249C241.753 89.249 236.875 84.3712 236.875 78.3541L236.875 12.9844C236.875 6.96732 241.753 2.08948 247.77 2.08948C253.787 2.08948 258.665 6.96731 258.665 12.9844L258.665 78.3541C258.665 84.3712 253.787 89.249 247.77 89.249Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M196.642 64.1883C192.387 59.9335 192.387 53.0352 196.642 48.7805L239.986 5.43576C244.241 1.18102 251.139 1.18101 255.394 5.43575C259.649 9.69049 259.649 16.5888 255.394 20.8435L212.049 64.1883C207.795 68.443 200.896 68.443 196.642 64.1883Z"
            stroke="currentColor"
            strokeWidth="2"
        />
        <circle cx="138.821" cy="45.6691" r="43.5798" stroke="currentColor" strokeWidth="2" />
        <circle cx="138.821" cy="45.6693" r="21.7899" stroke="currentColor" strokeWidth="2" />
        <line x1="1" y1="1.08936" x2="280.455" y2="1.08938" stroke="currentColor" strokeWidth="2" />
        <line x1="1" y1="89.3384" x2="280.455" y2="89.3384" stroke="currentColor" strokeWidth="2" />
    </svg>
);
