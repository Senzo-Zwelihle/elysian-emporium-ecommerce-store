import React from "react";
import { Container } from "@/components/ui/container";
import CreateNewNoteForm from "@/components/forms/create/create-note";

const CreateNewNoteRoute = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewNoteForm />
    </Container>
  );
};

export default CreateNewNoteRoute;
