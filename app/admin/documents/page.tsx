import React from "react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { FilePlus2Icon, FileStackIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/client/prisma";
import DocumentDataTable from "@/components/admin/components/document/data-table";


async function fetchDocuments() {
  const documents = await prisma.document.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      state: true,
      files: true,
      images: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return documents;
}

const DocumentsRoutePage = async () => {
  noStore();
  const documents = await fetchDocuments();
  // console.log(documents);
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          Documents
        </Heading>
        <Button
          effect="expandIcon"
          icon={FilePlus2Icon}
          iconPlacement="right"
          size={"store"}
        >
          <Link href={"/admin/documents/create-new"}>Upload Document</Link>
        </Button>
      </div>

      {/* document data */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <Heading
            size={"sm"}
            font={"PolySansSlim"}
            spacing={"normal"}
            lineHeight={"none"}
            margin={"md"}
          >
            No Documents Found!...
          </Heading>
          <FileStackIcon size={80} />
        </div>
      ) : (
        <div className="my-6">
          <DocumentDataTable
            data={documents.map((doc) => ({
              ...doc,
              createdAt: doc.createdAt.toISOString(),
              updatedAt: doc.updatedAt.toISOString(),
            }))}
          />
        </div>
      )}
    </Container>
  );
};

export default DocumentsRoutePage;
