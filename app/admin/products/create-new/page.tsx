import React from "react";
import { Container } from "@/components/ui/container";
import CreateNewProductForm from "@/components/forms/create/create-product";

const CreateNewNoteRoute = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewProductForm />
    </Container>
  );
};

export default CreateNewNoteRoute;
