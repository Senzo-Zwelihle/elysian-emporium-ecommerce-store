import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("", {
  variants: {
    size: {
      // max-width: 640px;
      sm: "max-w-screen-sm ",
      // max-width: 768px;
      md: "max-w-screen-md ",
      // max-width: 1024px;
      lg: "max-w-screen-lg ",
      // max-width: 1280px; default page size
      xl: "max-w-screen-xl ",
      // max-width: 1536px;
      "2xl": "max-w-screen-2xl ",
    },
    alignment: {
      left: "flex flex-col items-start justify-start text-left",
      right: "flex flex-col items-end justify-start text-right",
      center: "flex flex-col items-center justify-center ",
      spread:
        "flex flex-col space-y-10 items-center justify-center ",
    },
    height: {
      none: "",
      auto: "h-auto",
      full: "min-h-screen",
      screen: "h-screen",
    },
    padding: {
      none: "",
      sm: "mx-auto px-2 md:px-2 xl:px-2",
      md: "mx-auto px-4 md:px-6 xl:px-6",
    },
    
    default: {
      size: "xl",
      position: "center",
      height: "auto",
      padding: "none",
    },
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  href?: string;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    { className, children, size, alignment, height, padding, ...props },
    ref
  ) => {
    return (
      <section
        className={cn(
          containerVariants({ size, alignment, height, padding, className })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Container.displayName = "Container";

export { Container, containerVariants };
