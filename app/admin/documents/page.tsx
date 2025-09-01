import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import DocumentCommand from "@/components/admin/document/document-command";
import { Heading } from "@/components/ui/heading";
import { PlusIcon } from "@/components/icons/plus";

import DocumentWrapper from "@/components/admin/document/document-wrapper";
import { fetchAllDocuments } from "@/app/api/admin/document";

const DocumentsPage = async () => {
  noStore();
  const documents = await fetchAllDocuments();
  return (
    <Container
      size={"2xl"}
      alignment={"none"}
      height={"full"}
      padding={"px-sm"}
      gap={"none"}
      flow={"none"}
      id="tasks"
      className="my-4 space-y-4"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <Heading
          font={"aeonik"}
          size={"md"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Documents
        </Heading>

        <Button effect="expandIcon" icon={PlusIcon} iconPlacement="right">
          <Link href={"/admin/documents/create"}>Upload New</Link>
        </Button>
      </div>

      {/* main */}

      <DocumentCommand />
      <DocumentWrapper documents={documents} />
    </Container>
  );
};

export default DocumentsPage;
