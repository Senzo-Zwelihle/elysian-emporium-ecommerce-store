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
import { Textarea } from "@/components/ui/textarea";
import { Category, Status } from "@/lib/generated/prisma";
import { UploadDropzone } from "@/utils/upload/uploadthing";
import { editCollectionAction } from "@/server/actions/admin/collection";
import { collectionZodSchema } from "@/schemas/admin/collection";

// note props
interface EditCollectionFormProps {
  collectionPost: {
    id: string;
    label: string;
    description: string;
    color: string;
    image: string;
    url: string;
    state: string;
    category: string;
  };
}

const UpdateCollectionForm = ({ collectionPost }: EditCollectionFormProps) => {
  // form states
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //   doc schema form validation
  const form = useForm<z.infer<typeof collectionZodSchema>>({
    resolver: zodResolver(collectionZodSchema),
    defaultValues: {
      label: collectionPost.label,
      description: collectionPost.description,
      color: collectionPost.color,
      image: collectionPost.image,
      url: collectionPost.url,
      category: collectionPost.category,
      state: collectionPost.state,
    },
  });
  //   async function create new doc
  const onSubmit = (values: z.infer<typeof collectionZodSchema>) => {
    startTransition(async () => {
      const result = await editCollectionAction(collectionPost.id, values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/collections");
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        {/*  label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Label </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Appliances Collection" {...field} />
              </FormControl>
              <FormDescription>
                This is your public collection name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Description </FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. nintendo Promotion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*  color */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Color </FormLabel>
              <FormControl>
                <Input placeholder="e.g. #FF0000 Red Hex Value" {...field} />
              </FormControl>
              <FormDescription>
                This is your public collection name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* image */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Image</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt={document.title}
                        width={200}
                        height={200}
                        quality={95}
                        className=" object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={() => field.onChange("")}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="billboards"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl);
                        toast.success("Image uploaded successfully!");
                      }}
                      onUploadError={() => {
                        toast.error("Something went wrong. Please try again.");
                      }}
                      className="ut-button:bg-ultramarine-700 ut-allowed-content:text-muted-foreground border-ultramarine-700 ut-button:rounded-full"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*  url */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Url(Optional) </FormLabel>
              <FormControl>
                <Input placeholder="e.g.  http://localhost:3000/" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Category </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>collection category</SelectLabel>
                    {Object.values(Category).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* state */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection State </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>collection state</SelectLabel>
                    {Object.values(Status).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              Update Collection
              <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateCollectionForm;
