"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";

import { Collection } from "@/types/store/collection";

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group text-center"
    >
      <Link href={`/collections/${collection.id}`}>
        <div className="space-y-3">
          {/* Collection Image */}
          <div className="relative w-48 h-48 mx-auto">
            <Image
              src={collection.image}
              alt={collection.label}
              width={192}
              height={192}
              className="w-full h-full object-cover rounded-full"
            />

            {/* Category Badge */}
            <div className="absolute -top-1 -right-1">
              <Badge className="text-xs">{collection.category.name}</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <h3 className="font-semibold transition-colors text-lg">
              {collection.label}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
