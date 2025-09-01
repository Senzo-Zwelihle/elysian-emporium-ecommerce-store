import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import ElysianEmporiumErrorLogo from "@/public/assets/error/elysian-emporium-ecommerce-error.svg";

const Unauthorized = () => {
  return (
    <Container
      id="unauthorized"
      size={"2xl"}
      alignment={"center"}
      height={"screen"}
      padding={"px-sm"}
      gap={"none"}
      flow={"col"}
      className="space-y-4"
    >
    
      <Image
        src={ElysianEmporiumErrorLogo}
        alt="Unauthorized svg"
        width={100}
        height={100}
        className="rounded-2xl mb-5"
      />
      <Heading
        font={"aeonikBold"}
        size={"lg"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        401
      </Heading>

      <p className="text-base">
        You are not authorized to access this page. Please contact support if
        you believe this is a mistake.
      </p>

      <div className="grid grid-cols-2 space-x-2">
        <Link href={"/"}>
          <Button size={"lg"} >
            Support
          </Button>
        </Link>

        <Link href={"/"}>
          <Button size={"lg"} variant={"ghost"}>
            Sign Out
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default Unauthorized;
