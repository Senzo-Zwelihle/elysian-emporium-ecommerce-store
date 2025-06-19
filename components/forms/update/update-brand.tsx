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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/utils/upload/uploadthing";
import { Switch } from "@/components/ui/switch";
import { brandZodSchema } from "@/schemas/admin/brand";
import { editBrandAction } from "@/server/actions/admin/brand";

// note props
interface EditBrandFormProps {
  brandPost: {
    id: string;
    company: string;
    logo: string;
    active: boolean;
  };
}

const UpdateBrandForm = ({ brandPost }: EditBrandFormProps) => {
  // form states
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //   doc schema form validation
  const form = useForm<z.infer<typeof brandZodSchema>>({
    resolver: zodResolver(brandZodSchema),
    defaultValues: {
      company: brandPost.company,
      logo: brandPost.logo,
      active: brandPost.active,
    },
  });
  //   async function create new doc
  const onSubmit = (values: z.infer<typeof brandZodSchema>) => {
    startTransition(async () => {
      const result = await editBrandAction(brandPost.id, values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/brands");
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
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Samsung" {...field} />
              </FormControl>
              <FormDescription>This is public brand name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* logo */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt={document.title}
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
                        toast.success("logo uploaded successfully!");
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
        {/*  state */}
        <FormField
          control={form.control}
          name="active"
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
              Update Brand
              <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateBrandForm;
