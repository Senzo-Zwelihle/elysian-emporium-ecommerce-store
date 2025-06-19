import React from "react";
import CreateNewAddressForm from "@/components/forms/create/create-address";
import { Container } from "@/components/ui/container";

const CreateNewAddressRoutePage = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <CreateNewAddressForm />
    </Container>
  );
};

export default CreateNewAddressRoutePage;
