"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
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
import { Category, ProductStatus, ProductTag } from "@/lib/generated/prisma";
import { UploadDropzone } from "@/utils/upload/uploadthing";
import { productZodSchema } from "@/schemas/admin/product";
import { editProductAction } from "@/server/actions/admin/product";

interface EditProductFormProps {
  productPost: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    brand: string;
    price: number;
    stock: number;
    productVariant: string;
    productVariantValue: string;
    description: string;
    category: string;
    features: string;
    specifications: string;
    content: string;
    images: string[];
    tag: string;
    status: string;
  };
}

const BlockNoteEditor = dynamic(
  () => import("@/components/shared/blocknote-editor"),
  {
    ssr: false,
  }
);

const UpdateProductForm = ({ productPost }: EditProductFormProps) => {
  // form states
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //   block note states
  const [descriptionContent, setDescriptionContent] = useState("");
  const [featuresContent, setFeaturesContent] = useState("");
  const [contentContent, setContentContent] = useState("");
  const [specificationContent, setSpecificationContent] = useState("");

  //   note schema form validation
  const form = useForm<z.infer<typeof productZodSchema>>({
    resolver: zodResolver(productZodSchema),
    defaultValues: {
      name: productPost.name,
      slug: productPost.slug,
      sku: productPost.sku,
      brand: productPost.brand,
      price: productPost.price,
      stock: productPost.stock,
      productVariant: productPost.productVariant,
      productVariantValue: productPost.productVariantValue,
      description: productPost.description,
      category: productPost.category,
      features: productPost.features,
      specifications: productPost.specifications,
      content: productPost.content,
      images: productPost.images,
      tag: productPost.tag,
      status: productPost.status,
    },
  });

  //   async function create new collection
  const onSubmit = (values: z.infer<typeof productZodSchema>) => {
    startTransition(async () => {
      const result = await editProductAction(productPost.id, values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/products");
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Nike Hoodie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Slug </FormLabel>
              <FormControl>
                <Input placeholder="e.g. nike-hoodie-red" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* sku */}
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Stock Keeping </FormLabel>
              <FormControl>
                <Input placeholder="e.g. nike-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* brand */}
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Brand </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Nike" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Stock Number </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* variant */}
        <FormField
          control={form.control}
          name="productVariant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Variant </FormLabel>
              <FormControl>
                <Input placeholder="e.g. Red, Large" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* value */}
        <FormField
          control={form.control}
          name="productVariantValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Value </FormLabel>
              <FormControl>
                <Input placeholder="e.g. #ffff" {...field} />
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
              <FormLabel>Product Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product  category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>category</SelectLabel>
                    {Object.values(Category).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <BlockNoteEditor
                  initialContent={field.value}
                  onChange={(val) => {
                    setDescriptionContent(val);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              {/* Hidden input */}
              <Input
                type="hidden"
                name={field.name}
                value={descriptionContent}
                onChange={() => {}}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description */}
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Features</FormLabel>
              <FormControl className="w-[200px] h-[200px]">
                <BlockNoteEditor
                  initialContent={field.value}
                  onChange={(val) => {
                    setFeaturesContent(val);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              {/* Hidden input */}
              <Input
                type="hidden"
                name={field.name}
                value={featuresContent}
                onChange={() => {}}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* specification */}
        <FormField
          control={form.control}
          name="specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Specification</FormLabel>
              <FormControl>
                <BlockNoteEditor
                  initialContent={field.value}
                  onChange={(val) => {
                    setSpecificationContent(val);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              {/* Hidden input */}
              <Input
                type="hidden"
                name={field.name}
                value={specificationContent}
                onChange={() => {}}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Content</FormLabel>
              <FormControl>
                <BlockNoteEditor
                  initialContent={field.value}
                  onChange={(val) => {
                    setContentContent(val);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              {/* Hidden input */}
              <Textarea
                hidden
                name={field.name}
                value={contentContent}
                onChange={() => {}}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value?.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {field.value.map((url, index) => (
                        <div key={url} className="relative w-fit">
                          <Image
                            src={url}
                            alt={`Product Image ${index + 1}`}
                            width={200}
                            height={200}
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
                    endpoint="products"
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

        {/* tag */}
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Tag</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>product tag </SelectLabel>
                    {Object.values(ProductTag).map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>product state </SelectLabel>
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
              Update Product
              <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProductForm;
