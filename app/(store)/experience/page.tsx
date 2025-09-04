import React from "react";
import { Container } from "@/components/ui/container";
import CreateExperienceForm from "@/components/forms/create/create-experience";
import { Heading } from "@/components/ui/heading";

const Exp = () => {
  return (
    <Container
      size={"md"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="product-id"
      className="pt-24 space-y-8"
    >
      {/* Header */}
      <div>
        <Heading
          font={"aeonikBold"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"md"}
        >
          Experience
        </Heading>
       
      </div>
      <CreateExperienceForm />
    </Container>
  );
};

export default Exp;
