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
import { billboardZodSchema } from "@/schemas/admin/billboard";
import { editBillboardAction } from "@/server/actions/admin/billboard";

// note props
interface EditBillboardFormProps {
  billboardPost: {
    id: string;
    label: string;
    description: string;
    image: string;
    url: string;
    state: string;
    category: string;
  };
}

const UpdateBillboardForm = ({ billboardPost }: EditBillboardFormProps) => {
  // form states
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //   doc schema form validation
  const form = useForm<z.infer<typeof billboardZodSchema>>({
    resolver: zodResolver(billboardZodSchema),
    defaultValues: {
      label: billboardPost.label,
      description: billboardPost.description,
      image: billboardPost.image,
      url: billboardPost.url,
      category: billboardPost.category,
      state: billboardPost.state,
    },
  });
  //   async function create new doc
  const onSubmit = (values: z.infer<typeof billboardZodSchema>) => {
    startTransition(async () => {
      const result = await editBillboardAction(billboardPost.id, values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/billboards");
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
              <FormLabel>Billboard Label </FormLabel>
              <FormControl>
                <Input placeholder="e.g.  Fashion Billboard" {...field} />
              </FormControl>
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
              <FormLabel>Billboard Description </FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Summer Sale Promotion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* billbboard */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billboard Image</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt={document.title}
                        width={600}
                        height={600}
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
                      endpoint="billboards"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl);
                        toast.success("Images uploaded successfully!");
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
              <FormLabel>Billboard Url(Optional) </FormLabel>
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
              <FormLabel>Billboard Category </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>billboard category</SelectLabel>
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
              <FormLabel>Billboard State </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>billboard state</SelectLabel>
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
              Update Billboard
              <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateBillboardForm;
