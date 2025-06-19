"use client";

import React, { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { LoaderIcon, XIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DocumentStatus, DocumentType } from "@/lib/generated/prisma";
import { editDocumentAction } from "@/server/actions/admin/document";
import { UploadDropzone } from "@/utils/upload/uploadthing";
import PDFPlaceholder from "@/public/svg/pdf-placeholder.svg";
import { documentZodSchema } from "@/schemas/admin/document";

// note props
interface EditDocumentFormProps {
  documentPost: {
    id: string;
    name: string;
    type: string;
    state: string;
    files: string[];
    images: string[];
    published: boolean;
  };
}

const UpdateDocumentForm = ({ documentPost }: EditDocumentFormProps) => {
  // form states
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //   doc schema form validation
  const form = useForm<z.infer<typeof documentZodSchema>>({
    resolver: zodResolver(documentZodSchema),
    defaultValues: {
      name: documentPost.name,
      type: documentPost.type,
      state: documentPost.state,
      files: documentPost.files,
      images: documentPost.images,
      published: documentPost.published,
    },
  });
  //   async function create new doc
  const onSubmit = (values: z.infer<typeof documentZodSchema>) => {
    startTransition(async () => {
      const result = await editDocumentAction(documentPost.id, values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/documents");
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        {/*  title */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name </FormLabel>
              <FormControl>
                <Input placeholder="e.g. March invoices" {...field} />
              </FormControl>
              <FormDescription>
                This is your public document name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* document type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Document Type</SelectLabel>
                      {Object.values(DocumentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* document state */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document State</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Document State</SelectLabel>
                      {Object.values(DocumentStatus).map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* document files */}
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Files</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value?.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {field.value.map((url, index) => (
                        <div key={url} className="relative w-fit">
                          <Image
                            src={PDFPlaceholder}
                            alt={`Document ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md border object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 rounded-full"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <XIcon />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="documents"
                    onClientUploadComplete={(res) => {
                      const uploadedUrls = res.map((file) => file.ufsUrl);
                      field.onChange([...(field.value || []), ...uploadedUrls]);
                      toast.success("Documents uploaded successfully!");
                    }}
                    onUploadError={() => {
                      toast.error("Document Upload failed.Please try again.");
                    }}
                    className="ut-button:bg-ultramarine-700 ut-button:rounded-full"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* document images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value?.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {field.value.map((url, index) => (
                        <div key={url} className="relative w-fit">
                          <Image
                            src={url}
                            alt={`Product Image ${index + 1}`}
                            width={140}
                            height={140}
                            className="rounded-md border object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 rounded-full"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((_, i) => i !== index)
                              )
                            }
                          >
                            <XIcon />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="images"
                    onClientUploadComplete={(res) => {
                      const uploadedUrls = res.map((file) => file.ufsUrl);
                      field.onChange([...(field.value || []), ...uploadedUrls]);
                      toast.success("Images uploaded successfully!");
                    }}
                    onUploadError={() => {
                      toast.error("Upload failed. Try again.");
                    }}
                    className="ut-button:bg-ultramarine-700 ut-button:rounded-full"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* document published  */}
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* submit button */}
        <Button
          type="submit"
          disabled={isPending}
          size="store"
          effect="shineHover"
        >
          {isPending ? (
            <>
              Please wait...
              <LoaderIcon className="animate-spin" />
            </>
          ) : (
            <>
              Update Document
              <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateDocumentForm;
