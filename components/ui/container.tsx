import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("relative", {
  variants: {
    size: {
      sm: "max-w-(--breakpoint-sm)", // max-width: 640px;
      md: "max-w-(--breakpoint-md)", // max-width: 768px;
      lg: "max-w-(--breakpoint-lg)", // max-width: 1024px;
      xl: "max-w-(--breakpoint-xl)", // max-width: 1280px; default page size
      "2xl": "max-w-(--breakpoint-2xl)", // max-width: 1536px;
      full: "w-full", // 100% width
      none: "", // No max-width or width applied
    },
    alignment: {
      none: "",
      "top-left": "flex items-start justify-start text-left",
      "top-center": "flex items-start justify-center text-center",
      "top-right": "flex items-start justify-end text-right",
      "center-left": "flex items-center justify-start text-left",
      center: "flex items-center justify-center text-center",
      "center-right": "flex items-center justify-end text-right",
      "bottom-left": "flex items-end justify-start text-left",
      "bottom-center": "flex items-end justify-center text-center",
      "bottom-right": "flex items-end justify-end text-right",
      "space-between": "flex items-center justify-between",
      "space-around": "flex items-center justify-around",
      // Stretches children to fill height
      stretch: "flex items-stretch justify-center",
    },
    height: {
      none: "",
      auto: "h-auto",
      full: "h-full", // Occupies 100% of parent height
      screen: "min-h-screen", // Minimum height of the viewport
      "fit-content": "h-fit", // Takes height based on content
    },
    padding: {
      none: "",
      sm: "p-4 md:p-6 lg:p-8",
      md: "p-6 md:p-8 lg:p-10",
      lg: "p-8 md:p-10 lg:p-12",
      xl: "p-10 md:p-12 lg:p-14",
      "px-sm": "px-4 md:px-6 lg:px-6",
      "px-md": "px-6 md:px-8 lg:px-8",
      "px-lg": "px-8 md:px-10 lg:px-12",
      "py-sm": "py-4 md:py-6 lg:py-8",
      "py-md": "py-6 md:py-8 lg:py-10",
      "py-lg": "py-8 md:py-10 lg:py-12",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    flow: {
      none: "",
      row: "flex-row",
      col: "flex-col",
      "row-wrap": "flex-row flex-wrap",
      "col-wrap": "flex-col flex-wrap",
    },
    centered: {
      true: "mx-auto", // Centers the container itself
    },
  },
  defaultVariants: {
    size: "xl",
    alignment: "top-left",
    height: "auto",
    padding: "px-md",
    gap: "none",
    flow: "col",
    centered: true,
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      children,
      size,
      alignment,
      height,
      padding,
      gap,
      flow,
      centered,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          containerVariants({
            size,
            alignment,
            height,
            padding,
            gap,
            flow,
            centered,
            className,
          })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

export { Container, containerVariants };
