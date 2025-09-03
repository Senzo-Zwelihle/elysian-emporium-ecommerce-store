"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ClockIcon,
  CrownIcon,
  HeartIcon,
  PackageIcon,
  ShoppingBagIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ZarIcon from "@/components/icons/zar";

import {
  AccountOverviewData,
  RecentActivity,
} from "@/types/user/account/overview";

interface OverviewTabProps {
  data: AccountOverviewData;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  description,
  trend,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}) => (
  <Card className="bg-card border border-border shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend && (
            <TrendingUpIcon
              className={`h-3 w-3 ${
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                    ? "text-red-500"
                    : ""
              }`}
            />
          )}
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case "order":
        return <ShoppingBagIcon />;
      case "review":
        return <StarIcon />;
      case "favorite":
        return <HeartIcon />;
      default:
        return <PackageIcon />;
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case "order":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "review":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "favorite":
        return "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-full ${getActivityColor()}`}>
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {activity.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(activity.date, { addSuffix: true })}
        </p>
      </div>
      {activity.status && (
        <Badge variant="outline" className="text-xs">
          {activity.status}
        </Badge>
      )}
    </div>
  );
};

export const OverviewTab = ({ data }: OverviewTabProps) => {
  const { stats, recentActivities, upcomingDeliveries, recommendedProducts } =
    data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBagIcon}
          title="Total Orders"
          value={stats.totalOrders}
          description="Lifetime orders"
        />
        <StatCard
          icon={ZarIcon}
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          description="Lifetime spending"
        />
        <StatCard
          icon={StarIcon}
          title="Reviews"
          value={stats.totalReviews}
          description="Products reviewed"
        />
        <StatCard
          icon={HeartIcon}
          title="Favorites"
          value={stats.totalFavorites}
          description="Items saved"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        {/* Account Info & Membership */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CrownIcon />
              Account Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Member since
              </span>
              <span className="text-sm font-medium">
                {stats.joinedDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last login</span>
              <span className="text-sm font-medium">
                {stats.lastLoginDate
                  ? formatDistanceToNow(stats.lastLoginDate, {
                      addSuffix: true,
                    })
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Membership</span>
              <Badge variant={stats.membershipLevel ? "default" : "outline"}>
                {stats.membershipLevel || "Standard"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deliveries & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Deliveries */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon />
              Upcoming Deliveries
            </CardTitle>
            <CardDescription>Track your orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeliveries.length > 0 ? (
              upcomingDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {delivery.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {delivery.items} item(s) • Expected{" "}
                      {delivery.estimatedDate.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{delivery.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming deliveries
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommended Products */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon />
              Recommended for You
            </CardTitle>
            <CardDescription>Based on your activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedProducts.length > 0 ? (
              recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.image} alt={product.name} />
                    <AvatarFallback>{product.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIcon className=" fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recommendations available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
