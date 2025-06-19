"use client";

import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { LoaderIcon, SaveIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { createNewNoteAction } from "@/server/actions/admin/note";
import { NoteAction, NoteStatus, NoteTag } from "@/lib/generated/prisma";
import { noteZodSchema } from "@/schemas/admin/note";

// Dynamically import the editor with SSR disabled since its a client component
const BlockNoteEditor = dynamic(
  () => import("@/components/shared/blocknote-editor"),
  {
    ssr: false,
  }
);

const CreateNewNoteForm = () => {
  // form states
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  //   block note states
  const [noteContent, setNoteContent] = useState("");

  //   note schema form validation
  const form = useForm<z.infer<typeof noteZodSchema>>({
    resolver: zodResolver(noteZodSchema),
    defaultValues: {
      title: "",
      tag: "",
      status: "",
      action: "",
      published: false,
      content: "",
    },
  });

  //   async function create new note
  const onSubmit = (values: z.infer<typeof noteZodSchema>) => {
    startTransition(async () => {
      const result = await createNewNoteAction(values);

      if (result.success) {
        toast.success(result.message);
        router.push("/admin/notes");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Title </FormLabel>
              <FormControl>
                <Input placeholder="e.g. New Product planning" {...field} />
              </FormControl>
              <FormDescription>This is your public note name.</FormDescription>
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
              <FormLabel>Note Tag</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select note tag" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Note tag</SelectLabel>
                      {Object.values(NoteTag).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This can be anything from Idea, Todo, Inspiration, Reminder
              </FormDescription>
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
              <FormLabel>Note Status</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select note status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Note Status</SelectLabel>
                      {Object.values(NoteStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
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
        {/* status */}
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Action</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select note action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Note Action</SelectLabel>
                      {Object.values(NoteAction).map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
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
        {/* published state */}
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

        {/* block note */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Content</FormLabel>
              <FormControl>
                <BlockNoteEditor
                  initialContent={field.value}
                  onChange={(val) => {
                    setNoteContent(val);
                    field.onChange(val);
                  }}
                />
              </FormControl>
              {/* Hidden input outside FormControl */}
              <Textarea
                hidden
                name={field.name}
                value={noteContent}
                onChange={() => {}}
              />

              <FormDescription>
                Rich text editing right at your finger tips type / for commands
              </FormDescription>
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
              Create Note
              <SaveIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateNewNoteForm;
