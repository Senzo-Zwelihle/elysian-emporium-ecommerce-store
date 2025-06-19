import React from "react";
import { Container } from "@/components/ui/container";
import CreateNewCollectionForm from "@/components/forms/create/create-collection";

const CreateNewCollectionRoute = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewCollectionForm />
    </Container>
  );
};

export default CreateNewCollectionRoute;
