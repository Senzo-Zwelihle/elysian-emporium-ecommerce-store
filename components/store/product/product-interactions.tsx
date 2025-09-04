"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  EyeIcon, 
  ShareIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  TrendingUpIcon,
  StarIcon
} from "lucide-react";
import { useProductInteractions } from "@/hooks/use-product-interactions";

interface ProductInteractionsProps {
  productId: string;
  productName: string;
}

export function ProductInteractions({ productId, productName }: ProductInteractionsProps) {
  const { stats, loading } = useProductInteractions(productId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Interactions</CardTitle>
          <CardDescription>Tracking engagement for {productName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
                <span>View(s)</span>
              </div>
              <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShareIcon className="h-4 w-4 text-muted-foreground" />
                <span>Shares</span>
              </div>
              <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
                <span>Add to Cart</span>
              </div>
              <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartIcon className="h-4 w-4 text-muted-foreground" />
                <span>Favorites</span>
              </div>
              <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate engagement rate
  const totalInteractions = stats.views + stats.shares + stats.addToCart + stats.favorites;
  const engagementRate = stats.views > 0 ? Math.round((totalInteractions / stats.views) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Interactions</CardTitle>
        <CardDescription>Tracking engagement for {productName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
              <span>Views</span>
            </div>
            <span className="font-medium">{stats.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShareIcon className="h-4 w-4 text-muted-foreground" />
              <span>Shares</span>
            </div>
            <span className="font-medium">{stats.shares.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
              <span>Add to Cart</span>
            </div>
            <span className="font-medium">{stats.addToCart.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartIcon className="h-4 w-4 text-muted-foreground" />
              <span>Favorites</span>
            </div>
            <span className="font-medium">{stats.favorites.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Reviews</span>
            </div>
            <span className="font-medium">{stats.reviews.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <span>Engagement Rate</span>
            </div>
            <span className="font-medium">{engagementRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}