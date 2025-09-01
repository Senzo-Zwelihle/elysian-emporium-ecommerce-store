"use client";

import React from "react";
import {
  CrownIcon,
  DownloadIcon,
  SearchIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  banned: boolean | null;
  createdAt: Date;
  _count?: {
    orders?: number;
    reviews?: number;
  };
}

interface UsersTableProps {
  users: User[];
  total: number;
  totalPages: number;
  currentPage: number;
}


const roleIcons = {
  guest: UserIcon,
  user: UserIcon,
  administrator: ShieldIcon,
  owner: CrownIcon,
  member: UserIcon,
};

const UsersTable = ({
  users,
  total,
  totalPages,
  currentPage,
}: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              Manage customer accounts and their information
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const RoleIcon =
                  roleIcons[user.role as keyof typeof roleIcons] || UserIcon;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">
                          {user.points.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          pts
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user._count?.orders || 0}</TableCell>
                    <TableCell>{user._count?.reviews || 0}</TableCell>
                    <TableCell>
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge>Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {users.length} of {total} customers
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTable;
