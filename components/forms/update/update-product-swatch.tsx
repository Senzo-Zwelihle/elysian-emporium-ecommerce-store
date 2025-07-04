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
import { UploadDropzone } from "@/utils/upload/uploadthing";
import { productSwatchZodSchema } from "@/schemas/admin/product-swatch";
import {
  editSwatchAction,
} from "@/server/actions/admin/product-swatch";
import { ProductStatus, ProductSwatchType } from "@/lib/generated/prisma";

interface EditProductSwatchFormProps {
  swatchData: {
    id: string;
    productId: string;
    type: string;
    name: string;
    value: string;
    images: string[];
  };
}

const EditProductSwatchForm = ({ swatchData }: EditProductSwatchFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof productSwatchZodSchema>>({
    resolver: zodResolver(productSwatchZodSchema),
    defaultValues: {
      productId: swatchData.productId,
      type: swatchData.type as ProductSwatchType,
      status: swatchData.type as ProductStatus,
      name: swatchData.name,
      value: swatchData.value,
      images: swatchData.images || [],
    },
  });

  const onSubmit = (values: z.infer<typeof productSwatchZodSchema>) => {
    startTransition(async () => {
      const result = await editSwatchAction(swatchData.id, values);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        router.back();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Swatch Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swatch Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product swatch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>swatch</SelectLabel>
                    {Object.values(ProductSwatchType).map((swatch) => (
                      <SelectItem key={swatch} value={swatch}>
                        {swatch}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swatch Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product swatch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>status</SelectLabel>
                    {Object.values(ProductStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Swatch Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swatch Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Red, Small" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Swatch Value */}
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swatch Value</FormLabel>
              <FormControl>
                {form.watch("type") === "COLOR" ? (
                  <Input type="color" className="w-20 h-10 p-1" {...field} />
                ) : (
                  <Input placeholder="e.g. #FF0000, 10-inch" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Swatch Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Swatch Images (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {field.value.map((url, index) => (
                        <div key={url} className="relative w-fit">
                          <Image
                            src={url}
                            alt={`Swatch Image ${index + 1}`}
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
                                field.value?.filter((_, i) => i !== index)
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
                    endpoint="products" // Assuming 'products' endpoint handles swatch images too
                    onClientUploadComplete={(res) => {
                      const uploadedUrls = res.map((file) => file.url);
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          effect="shineHover"
        >
          {isPending ? (
            <>
              Please wait...
              <LoaderIcon className="animate-spin ml-2" />
            </>
          ) : (
            <>
              Save Changes
              <SaveIcon className="ml-2" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditProductSwatchForm;
