"use client";

import React, { Suspense } from "react";
import { Container } from "@/components/ui/container";
import MembershipPlansContent from "@/components/store/components/account/membership-content";

const PlansPage = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-4">
      <Suspense fallback={<p className="text-center">please wait...</p>}>
        <MembershipPlansContent />
      </Suspense>
    </Container>
  );
};

export default PlansPage;
