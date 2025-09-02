import React from "react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { UsersIcon } from "@/components/icons/users";

import UsersTable from "@/components/admin/user/data-table";

import { fetchAllUsers } from "@/app/api/admin/user";

const Users = async () => {
  noStore();
  const users = await fetchAllUsers();
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="users"
      className="my-4"
    >
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Users
        </Heading>
        <Button>
          <Link href={"/admin/user/create-new"}>Add User</Link>
        </Button>
      </div>

      {/* main */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading size="sm" font="aeonik" margin="md">
            No Users Found!
          </Heading>
          <UsersIcon size={80} />
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </Container>
  );
};

export default Users;
