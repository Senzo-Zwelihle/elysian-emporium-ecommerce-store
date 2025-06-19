import React from "react";
import { Container } from "@/components/ui/container";
import CreateNewBillboardForm from "@/components/forms/create/create-billboard";

const CreateNewBillboardRoute = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewBillboardForm />
    </Container>
  );
};

export default CreateNewBillboardRoute;
