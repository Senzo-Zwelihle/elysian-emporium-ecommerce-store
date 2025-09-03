import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { MembershipCard } from "@/components/store/membership/membership-card";

import { auth } from "@/lib/auth";

import { getUserMembershipInfo } from "@/server/actions/user/membership";

export default async function MembershipPage() {
  noStore();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <Container
        size={"2xl"}
        alignment={"none"}
        height={"screen"}
        padding={"px-md"}
        gap={"none"}
        flow={"none"}
        id="membership"
        className="pt-24 overflow-hidden"
      >
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Membership Program</h1>
          <p>Please sign in to view your membership information.</p>
        </div>
      </Container>
    );
  }

  const membershipInfo = await getUserMembershipInfo(session.user.id);

  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"screen"}
      padding={"px-md"}
      gap={"none"}
      flow={"none"}
      id="membership"
      className="pt-24"
    >
      <div className="space-y-8">
        <div>
          <Heading
            font={"aeonikBold"}
            size={"md"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"none"}
          >
            Membership
          </Heading>

          <p className="text-muted-foreground mt-2">
            Earn points and unlock exclusive benefits
          </p>
        </div>

        <MembershipCard membershipInfo={membershipInfo} />

        {membershipInfo.user.membershipHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {membershipInfo.user.membershipHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border"
                >
                  <div>
                    <p className="font-medium">
                      {entry.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-medium text-green-600">
                    +{entry.points} points
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
