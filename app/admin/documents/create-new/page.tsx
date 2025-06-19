import React from "react";
import { Container } from "@/components/ui/container";
import CreateNewDocumentForm from "@/components/forms/create/create-document";

const CreateNewDocumentRoute = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewDocumentForm />
    </Container>
  );
};

export default CreateNewDocumentRoute;
