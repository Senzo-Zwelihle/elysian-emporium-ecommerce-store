import React from "react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { prisma } from "@/lib/client/prisma";
import {
  EditIcon,
  EyeIcon,
  MoreHorizontalIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

async function fetchUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      phoneNumber: true,
      role: true,
      status: true,
      membership: true,
      favorites: true,
      reviews: true,
      documents: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

const UsersRoutePage = async () => {
  noStore();
  const users = await fetchUsers();
  // console.log(users);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"sm"}
        >
          Users
        </Heading>
      </div>

      {/* users data */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySans"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Users Found...
          </Heading>
          <UsersIcon size={100} />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recent users who signed up.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Firstname</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Membership</TableHead>
              <TableHead>Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Image
                    alt="User Image"
                    src={user.profileImage}
                    height={64}
                    width={64}
                    className="rounded-full w-9 h-9"
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.membership}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <EyeIcon  />
                        <Link href={`/admin/users/${user.id}`}>View User</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EditIcon />
                        <Link href={`/admin/users/${user.id}/edit`}>
                          Manage User
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-coral-red-600">
                        <TrashIcon  />
                        <Link href={`/admin/users/${user.id}/delete`}>
                          Delete User
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default UsersRoutePage;
