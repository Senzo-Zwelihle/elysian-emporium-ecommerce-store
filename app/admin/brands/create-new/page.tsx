import React from "react";
import { Container } from "@/components/ui/container";
import CreateNewBrandForm from "@/components/forms/create/create-brand";

const CreateNewBrandRoute = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewBrandForm />
    </Container>
  );
};

export default CreateNewBrandRoute;
