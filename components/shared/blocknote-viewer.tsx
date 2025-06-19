"use client";

import React from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface BlockNoteViewerProps {
  blockNoteContent: string | string[] | undefined | null;
}

const BlockNoteViewer = ({ blockNoteContent }: BlockNoteViewerProps) => {
  const { resolvedTheme } = useTheme();
  console.log("blockNoteContent received:", blockNoteContent);

  let contentToParse: string | undefined | null;

  if (Array.isArray(blockNoteContent)) {
    // If it's an array, take the first element if it exists
    contentToParse =
      blockNoteContent.length > 0 ? blockNoteContent[0] : undefined;
  } else {
    // Otherwise, use it as is (string, undefined, or null)
    contentToParse = blockNoteContent;
  }

  let initialBlocks: PartialBlock[] = [];
  if (contentToParse) {
    try {
      const parsedContent = JSON.parse(contentToParse);
      if (Array.isArray(parsedContent)) {
        initialBlocks = parsedContent as PartialBlock[];
      } else {
        console.warn(
          "BlockNote content is not an array after parsing:",
          parsedContent
        );
      }
    } catch (e) {
      console.error("Failed to parse BlockNote content JSON:", e);
    }
  }

  const editor = useCreateBlockNote({
    initialContent: initialBlocks,
  });

  return (
    <div className="prose max-w-full dark:prose-invert">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={false}
        slashMenu={false}
        formattingToolbar={false}
      />
    </div>
  );
};

export default BlockNoteViewer;
