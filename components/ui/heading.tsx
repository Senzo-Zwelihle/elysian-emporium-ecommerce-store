import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("", {
  variants: {
    font: {
      aeonik: "font-(family-name:--font-aeonik)",
      aeonikLight: "font-(family-name:--font-aeonikLight)",
      aeonikBold: "font-(family-name:--font-aeonikBold)",
    },
    size: {
      xs: "text-xs md:text-xl",
      sm: "text-2xl md:text-3xl",
      md: "text-3xl md:text-5xl",
      lg: "text-5xl md:text-7xl",
      xl: "text-6xl md:text-8xl",
    },
    spacing: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },

    lineHeight: {
      none: "leading-none",
      sm: "leading-3",
      md: "leading-4",
      lg: "leading-5",
      xl: "leading-6",
      "2xl": "leading-7",
    },
    margin: { none: "mb-0", sm: "mb-3", md: "mb-10", lg: "mb-20" },
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  href?: string;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      children,
      font,
      size,
      spacing,

      lineHeight,
      margin,

      ...props
    },
    ref
  ) => {
    return (
      <h1
        className={cn(
          headingVariants({
            className,
            font,
            size,
            spacing,

            lineHeight,
            margin,
          })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
