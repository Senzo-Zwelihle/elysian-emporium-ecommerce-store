"use client";

import React, { useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { LoaderIcon, SaveIcon, XIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "@/utils/upload/uploadthing";
import { StoreStatus } from "@/lib/generated/prisma";
import { editStoreAction } from "@/server/actions/admin/store";
import { storeZodSchema } from "@/schemas/admin/store";

// Define the type for the props received by this component
interface EditStoreFormProps {
  storeData: {
    id: string;
    name: string;
    description: string | null;
    location: string;
    website: string;
    socials: string[];
    logo: string;
    status: StoreStatus; // Use the imported Prisma enum type
  };
}

const UpdateStoreForm = ({ storeData }: EditStoreFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof storeZodSchema>>({
    resolver: zodResolver(storeZodSchema),
    defaultValues: {
      name: storeData.name,
      description: storeData.description,
      location: storeData.location,
      website: storeData.website,
      socials: storeData.socials,
      logo: storeData.logo,
      status: storeData.status,
    },
  });

  const onSubmit = (values: z.infer<typeof storeZodSchema>) => {
    startTransition(async () => {
      const result = await editStoreAction(storeData.id, values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/stores"); // Navigate back to the stores list
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        {/* Store Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Awesome Store" {...field} />
              </FormControl>
              <FormDescription>The public name of your store.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of your store..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Provide a short description for the store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Pretoria, Gauteng" {...field} />
              </FormControl>
              <FormDescription>
                The physical or primary location of the store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="e.g. https://www.mystore.com" {...field} />
              </FormControl>
              <FormDescription>
                The official website address for the store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* socials */}
        <FormField
          control={form.control}
          name="socials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Links</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. https://facebook.com/mystore (Optional)"
                  value={field.value?.[0] || ""}
                  onChange={(e) => field.onChange([e.target.value])}
                />
              </FormControl>
              <FormDescription>
                Add primary social media link. For multiple, you&apos;ll need a
                more advanced input.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="Store Logo"
                        width={400}
                        height={400}
                        quality={95}
                        className="rounded-md border object-cover"
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
                      endpoint="images"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl);
                        toast.success("Logo uploaded successfully!");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload error: ${error.message}`);
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

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The current operational status of the store.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
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
              Update Store
              <SaveIcon  />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateStoreForm;
