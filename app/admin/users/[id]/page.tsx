import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeftIcon, ShieldBanIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BanUserModal from "@/components/admin/user/ban-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { prisma } from "@/lib/prisma/client";

import { User } from "@/types/admin/user";

async function getUserById(id: string): Promise<User | null> {
  noStore();
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      membership: true,
      _count: {
        select: {
          sessions: true,
          accounts: true,
          orders: true,
          reviews: true,
          favorites: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    banExpires: user.banExpires?.toISOString() ?? null,
  };
}

type Params = Promise<{ id: string }>;

const UserDetailsPage = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }
  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="user-details"
      className="my-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <Heading
            font={"aeonik"}
            size={"sm"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"none"}
          >
            User Details
          </Heading>
        </div>
        <div className="flex gap-2">
          {user.banned ? (
            <Button variant="outline" disabled>
              <ShieldBanIcon className="h-4 w-4 mr-2" />
              Banned
            </Button>
          ) : (
            <BanUserModal
              userId={user.id}
              userName={user.name}
              userEmail={user.email}
            />
          )}
          <Button variant="destructive">
            <Trash2Icon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  className="rounded-full"
                  src={
                    user.image ?? "/assets/placeholders/avatar-placeholder.png"
                  }
                  width={80}
                  height={80}
                  alt={user.name}
                />
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  {user.phoneNumber && (
                    <p className="text-muted-foreground">{user.phoneNumber}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge
                    variant={
                      user.role === "administrator"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Membership</p>
                  <Badge variant="outline">
                    {user.membership?.title ?? "No membership"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {user.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Points</p>
                  <p className="font-medium">{user.points}</p>
                </div>
              </div>

              {user.banned && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Ban Reason</p>
                    <p className="font-medium">
                      {user.banReason ?? "No reason provided"}
                    </p>
                  </div>
                  {user.banExpires && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ban Expires
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.banExpires), "PPpp")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/admin/users/${user.id}/update`}>Edit User</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.sessions}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.accounts}</p>
                  <p className="text-sm text-muted-foreground">Accounts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.orders}</p>
                  <p className="text-sm text-muted-foreground">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.reviews}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user._count.favorites}</p>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p>{format(new Date(user.createdAt), "PPpp")}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{format(new Date(user.updatedAt), "PPpp")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-4">
                No recent activity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default UserDetailsPage;
