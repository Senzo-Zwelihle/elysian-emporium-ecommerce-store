import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import {
  StarIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

async function fetchFeedbackStats() {
  noStore();

  try {
    // Fetch review stats
    const [
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      averageRating,
    ] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { status: "approved" } }),
      prisma.review.count({ where: { status: "pending" } }),
      prisma.review.count({ where: { status: "rejected" } }),
      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    // Fetch experience stats
    const [totalExperiences, averageExperienceRating] = await Promise.all([
      prisma.experience.count(),
      prisma.experience.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    return {
      reviews: {
        total: totalReviews,
        approved: approvedReviews,
        pending: pendingReviews,
        rejected: rejectedReviews,
        averageRating: averageRating._avg.rating || 0,
      },
      experiences: {
        total: totalExperiences,
        averageRating: averageExperienceRating._avg.rating || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    return {
      reviews: {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        averageRating: 0,
      },
      experiences: {
        total: 0,
        averageRating: 0,
      },
    };
  }
}

export async function FeedbackStatsWidget() {
  const stats = await fetchFeedbackStats();

  const approvalRate =
    stats.reviews.total > 0
      ? Math.round((stats.reviews.approved / stats.reviews.total) * 100)
      : 0;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Customer Feedback</CardTitle>
        <CardDescription>
          Overview of product reviews and user experiences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviews Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquareIcon className="h-4 w-4" />
                  Product Reviews
                </h3>
                <span className="text-sm font-medium">
                  {stats.reviews.total}
                </span>
              </div>
              <Progress
                value={
                  (stats.reviews.approved / Math.max(stats.reviews.total, 1)) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ThumbsUpIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {stats.reviews.approved}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ThumbsDownIcon className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">
                    {stats.reviews.rejected}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">{stats.reviews.pending}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>Avg Rating</span>
              </div>
              <span className="font-medium">
                {stats.reviews.averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Experiences Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center gap-2">
                  <StarIcon className="h-4 w-4" />
                  User Experiences
                </h3>
                <span className="text-sm font-medium">
                  {stats.experiences.total}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>Avg Rating</span>
              </div>
              <span className="font-medium">
                {stats.experiences.averageRating.toFixed(1)}
              </span>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                {approvalRate}% of reviews are approved
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
