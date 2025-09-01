import React from "react";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

const AdminDashboardPage = () => {
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="admin-dashboard"
      className="my-4"
    >
      <Heading
        font={"aeonik"}
        size={"md"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"none"}
      >
        Admin
      </Heading>
    </Container>
  );
};

export default AdminDashboardPage;
