import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

const UserIdRoutePage = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <Heading
        size={"md"}
        font={"PolySansBulky"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        UserID
      </Heading>
    </Container>
  );
};

export default UserIdRoutePage;
