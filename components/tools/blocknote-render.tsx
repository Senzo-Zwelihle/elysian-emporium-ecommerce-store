"use client";

import { useTheme } from "next-themes";
import { PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import "@blocknote/mantine/style.css";
import "@/app/globals.css";

interface BlockNoteViewerProps {
  initialContent: string;
}

const BlockNoteRender = ({ initialContent }: BlockNoteViewerProps) => {
  const { resolvedTheme } = useTheme();

  const blocks: PartialBlock[] = initialContent
    ? JSON.parse(initialContent)
    : [];

  const editor = useCreateBlockNote({
    initialContent: blocks,
  });

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editable={false} 
      data-theming-css-variables-demo
      data-color-scheme={resolvedTheme}
      className="[&_.bn-container]:!p-0 [&_.bn-editor]:!p-0"
    />
  );
};

export default BlockNoteRender;