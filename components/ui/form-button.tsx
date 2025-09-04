"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

interface FormSubmitButtonProps {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ReactNode;
  className?: string;
}

export function FormSubmitButton({
  text,
  variant = "default",
  size = "default",
  icon,
  className,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      disabled={pending}
      className={cn(className)}
    >
      {pending ? (
        <Spinner className="mr-2 h-4 w-4" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {pending ? "Processing..." : text}
    </Button>
  );
}