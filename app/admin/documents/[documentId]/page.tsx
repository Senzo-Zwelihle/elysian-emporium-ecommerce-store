import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CircleCheckIcon,
  DownloadCloud,
  File,
  FileX,
  ImageIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/client/prisma";
import DocumentViewer from "@/components/admin/components/document/document-viewer";
import { setDocumentStatus, setDocumentType } from "@/types/admin/document";

async function getDocumentData({ documentId }: { documentId: string }) {
  const documentPost = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
    select: {
      id: true,
      name: true,
      type: true,
      state: true,
      files: true,
      images: true,
      published: true,
      user: {
        select: {
          id: true,
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });

  if (!documentPost) {
    return notFound();
  }

  return documentPost;
}

type Params = Promise<{ documentId: string }>;
const DocumentIdRoutePage = async ({ params }: { params: Params }) => {
  const { documentId } = await params;
  const documentPost = await getDocumentData({ documentId });
  // console.log(documentPost);
  const documentStatus = setDocumentStatus(documentPost.state ?? "");
  const documentType = setDocumentType(documentPost.type ?? "");

  if (!documentPost) {
    return notFound();
  }
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-6">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansMedian"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"none"}
        >
          {documentPost.name}
        </Heading>
        <Button
          variant={"destructive"}
          effect="expandIcon"
          icon={TrashIcon}
          iconPlacement="right"
          size={"lg"}
        >
          <Link href={`/admin/documents/${documentPost.id}/delete`}>
            Delete Document
          </Link>
        </Button>
      </div>
      <Separator className="mb-4 my-6" />

      {/* layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* tab list */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="files" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="files">
                <File className="h-4 w-4 mr-2" />
                Files ({documentPost.files.length})
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="h-4 w-4 mr-2" />
                Images ({documentPost.images.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="files" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {documentPost.files.length > 0 ? (
                    <div className="space-y-3">
                      <DocumentViewer pdfUrl={documentPost.files[0]} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileX className="h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">
                        No files attached
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This document doesn&apos;t have any files attached.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="images" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {documentPost.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {documentPost.images.map((image, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Document image ${index + 1}`}
                            fill
                            className="object-cover transition-all group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" size="sm" asChild>
                              <a
                                href={image}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DownloadCloud className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileX className="h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">
                        No images attached
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This document doesn&apos;t have any images attached.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* card list */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-medium">Document Information</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    {documentPost.published ? (
                      <>
                        <CircleCheckIcon className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Published</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Unpublished</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Type
                  </p>
                  {/* tag */}
                  {documentStatus.label && (
                    <Badge className={`${documentStatus.color}`}>
                      {documentStatus.label}
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    State
                  </p>
                  {/* type */}
                  {documentType.label && (
                    <Badge className={`${documentType.color}`}>
                      {documentType.label}
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    ID
                  </p>
                  <code className="text-xs bg-muted p-1 rounded">
                    {documentPost.id}
                  </code>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Created By
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          documentPost.user.profileImage ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={documentPost.user.firstName}
                      />
                      <AvatarFallback>
                        {documentPost.user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {documentPost.user.firstName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {documentPost.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default DocumentIdRoutePage;
