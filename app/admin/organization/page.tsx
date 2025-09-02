import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons/plus";

import { auth } from "@/lib/auth";

import { SwitchOrganizationDialog } from "@/components/admin/organization/switch-organization";
import InviteMemberForm from "@/components/admin/organization/invite-member";
import ManageMembers from "@/components/admin/organization/manage-members";
import OrganizationInvitations from "@/components/admin/organization/organization-invitations";
import UpdateOrganizationForm from "@/components/admin/organization/update-organization";
import { DeleteOrganizationButton } from "@/components/admin/organization/delete-organization";

import {
  getOrganizationInvitationsAction,
  getUserOrganizationsAction,
} from "@/server/actions/admin/organization";

const OrganizationPage = async () => {
  // Get session first
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className=" mx-auto container py-8">
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (session.user.role !== "administrator" && session.user.role !== "owner") {
    return (
      <div className="container py-8">
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // Get user organizations
  const organizationsData = await getUserOrganizationsAction();

  if (organizationsData.status !== "success") {
    return (
      <div className="container py-8">
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>Failed to load organizations: {organizationsData.message}</p>
        </div>
      </div>
    );
  }

  // results
  const organizations = organizationsData.data || [];
  const activeOrganization = organizations[0];

  // Get invitations for the active organization
  let invitationsResult;
  if (activeOrganization) {
    invitationsResult = await getOrganizationInvitationsAction(
      activeOrganization.id
    );
  }
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="settings"
      className="my-4"
    >
      <div className="flex items-center justify-between mb-5">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Organization
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/organization/create"}>Create New</Link>
        </Button>
      </div>

      {/* data */}
      {organizations.length > 0 && activeOrganization && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{activeOrganization.name}</h2>
              <p className="text-muted-foreground">
                Manage members and for this organization.
              </p>
            </div>
            <SwitchOrganizationDialog
              organizations={organizations}
              currentOrganizationId={activeOrganization.id}
            />
          </div>

          <Tabs defaultValue="members" className="w-full">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invite Member</CardTitle>
                  <CardDescription>
                    Invite a new member to join your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InviteMemberForm organizationId={activeOrganization.id} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization Members</CardTitle>
                  <CardDescription>
                    Manage members and their roles in your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ManageMembers
                    members={activeOrganization.members}
                    organizationId={activeOrganization.id}
                    currentUserId={session.user.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="invitations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>
                    View and manage pending invitations to your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {invitationsResult?.status === "success" ? (
                    <OrganizationInvitations
                      invitations={invitationsResult.data || []}
                      currentUserId={session.user.id}
                    />
                  ) : (
                    <div className="rounded-md border p-6 text-center">
                      <p className="text-muted-foreground">
                        Failed to load invitations: {invitationsResult?.message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    Update your organization's name and other settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpdateOrganizationForm organization={activeOrganization} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete this organization and all its data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteOrganizationButton
                    organizationId={activeOrganization.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Container>
  );
};

export default OrganizationPage;
