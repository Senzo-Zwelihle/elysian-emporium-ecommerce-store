import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users as UsersIcon } from "lucide-react";
import { UsersTabProps } from "@/types/admin/admin-dashboard";



const UsersTab = ({ users }: UsersTabProps) => {
  return (
    <>
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-muted-foreground">
          <UsersIcon size={60} />
          <p className="mt-2">No recent users found.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of recently registered users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Image
                    alt="User Image"
                    src={user.profileImage}
                    height={40}
                    width={40}
                    className="rounded-full w-9 h-9 object-cover"
                  />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(user.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default UsersTab;
