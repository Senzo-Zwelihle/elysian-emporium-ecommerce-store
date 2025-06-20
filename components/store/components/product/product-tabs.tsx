"use client";
import React from "react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import BlockNoteViewer from "@/components/shared/blocknote-viewer";

interface ProductTabsProps {
  description: string;
  features: string;
  content?: string | null;
  specifications?: string | null;
}

const ProductTabs = ({
  description,
  features,
  content,
  specifications,
}: ProductTabsProps) => {
  // Helper to safely render content, now passing string directly to BlockNoteViewer
  const renderContent = (jsonString: string | null | undefined) => {
   
    if (!jsonString)
      return <p className="text-muted-foreground">No content available.</p>;

    // We pass the string directly, and BlockNoteViewer handles the JSON.parse
    return <BlockNoteViewer blockNoteContent={jsonString} />;
  };
  const tabs = [
    {
      id: "description",
      title: "Description",
      content: renderContent(description),
      hidden: !description,
    },
    {
      id: "features",
      title: "Features",
      content: renderContent(features),
      hidden: !features,
    },
    {
      id: "specifications",
      title: "Specifications",
      content: renderContent(specifications),
      hidden: !specifications,
    },
    {
      id: "content",
      title: "Content",
      content: renderContent(content),
      hidden: !content,
    },
  ].filter((tab) => !tab.hidden); 

  if (tabs.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm md:p-6"
    >
      <Tabs defaultValue={tabs[0]?.id} className="w-full">
        <TabsList className="grid w-full h-auto py-1 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-sm md:text-base"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <Separator className="mb-4" />
            <div className="text-sm">{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default ProductTabs;
