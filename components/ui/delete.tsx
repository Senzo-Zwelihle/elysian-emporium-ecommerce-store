"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import { DeleteIcon } from "@/components/icons/delete";

interface buttonProps {
  text: string;
}

export function DeleteButton({ text }: buttonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled variant={"destructive"}>
          <Spinner /> Please Wait...
        </Button>
      ) : (
        <Button
          type="submit"
          variant={"destructive"}
          effect="expandIcon"
          icon={DeleteIcon}
          iconPlacement="left"
          
        >
          {text}
        </Button>
      )}
    </>
  );
}
