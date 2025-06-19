"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

export function FormSubmitButton({
  text,
  icon,
  variant,
  width = "w-full",
}: {
  text: string;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  width?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      className={width}
      effect="shineHover"
      size={"lg"}
    >
      {pending ? (
        <>
          <span>Please wait...</span>
          <LoaderIcon className="animate-spin" />
        </>
      ) : (
        <>
          <span>{text}</span>
          {icon && <div className="">{icon}</div>}
        </>
      )}
    </Button>
  );
}
