"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  Trash2Icon,
  EyeIcon,
  PackageIcon,
  StarIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  HomeIcon,
  MessageSquareTextIcon,
  LogOutIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfileClientProps } from "@/interfaces/store/account";
import {
  accountContainerVariants,
  accountItemVariants,
  accountTabContentVariants,
} from "@/utils/animation/motion";
import { getStatusColor } from "@/types/shop/order";


const AccountClient = ({
  user,
  addresses,
  orders,
  favorites,
  reviews,
}: UserProfileClientProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editingProfile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const tabs = [
    { id: "account", label: "Account", icon: UserIcon },
    { id: "addresses", label: "Addresses", icon: MapPinIcon },
    { id: "orders", label: "Orders", icon: ShoppingBagIcon },
    { id: "favorites", label: "Favorites", icon: HeartIcon },
    { id: "reviews", label: "Reviews", icon: StarIcon },
  ];
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // tab content
  const renderTabContent = () => {
    switch (activeTab) {
      // profile tab
      case "account":
        return (
          <motion.div
            variants={accountTabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <Card className="rounded-2xl shadow-sm border-none">
              <CardHeader className="flex flex-col md:flex-row items-center justify-between p-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    <Avatar className="w-24 h-24 border-4 border-input shadow-lg">
                      <AvatarImage
                        src={user.profileImage || "/placeholder-avatar.jpg"}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription>
                      <span className="flex items-center gap-1 text-sm">
                        <MailIcon size={14} /> {user.email}
                      </span>
                      {/* <span className="flex items-center gap-1 text-sm">
                        <PhoneIcon size={14} /> +1 (555) 123-4567
                      </span> */}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={user.firstName}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={user.lastName}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user.email}
                      disabled={!editingProfile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <p className="text-sm py-2 px-3 border border-input rounded-md bg-muted/50">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBagIcon size={24} />
                  <span>Total Orders</span>
                </div>
                <p className="text-3xl font-bold">{totalOrders}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CreditCardIcon size={24} />
                  <span>Total Spent</span>
                </div>
                <p className="text-3xl font-bold">R {totalSpent.toFixed(2)}</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <HeartIcon size={24} />
                  <span>Favorite Items</span>
                </div>
                <p className="text-3xl font-bold">{favorites.length}</p>
              </motion.div>
            </div>
          </motion.div>
        );
      // addresses
      case "addresses":
        return (
          <motion.div
            variants={accountTabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <MapPinIcon
                    size={80}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-lg">No addresses found!</p>
                </div>
              ) : (
                addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="rounded-2xl shadow-sm border-none relative h-full flex flex-col">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                            <HomeIcon size={20} className="text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {address.label || "Address"}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {address.fullName}
                            </CardDescription>
                          </div>
                        </div>
                        {address.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-1 flex-grow">
                        <p>{address.streetAddress}</p>
                        {address.streetAddress2 && (
                          <p>{address.streetAddress2}</p>
                        )}
                        <p>
                          {address.city}, {address.province}{" "}
                          {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                        <p className="flex items-center gap-1">
                          <PhoneIcon size={14} /> {address.phoneNumber}
                        </p>
                      </CardContent>
                      <div className="flex gap-2 p-6 pt-0">
                        <Button variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button variant="destructive" size="icon">
                          <Trash2Icon size={16} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      case "orders":
        return (
          <motion.div
            variants={accountTabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Order History</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon size={16} className="mr-2" /> Filter by Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Order Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All Orders</DropdownMenuItem>
                  <DropdownMenuItem>Delivered</DropdownMenuItem>
                  <DropdownMenuItem>Processing</DropdownMenuItem>
                  <DropdownMenuItem>Shipped</DropdownMenuItem>
                  <DropdownMenuItem>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <ShoppingBagIcon
                    size={80}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-lg">No orders found!</p>
                </div>
              ) : (
                orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ x: 5 }}
                  >
                    <Card className="rounded-2xl shadow-sm border-none">
                      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-16 h-16 rounded-lg overflow-hidden">
                            <AvatarImage
                              src={
                                order.items[0]?.product?.images[0] ||
                                "/placeholder-product.jpg"
                              }
                              alt={order.orderNumber}
                            />
                            <AvatarFallback>
                              <PackageIcon size={24} />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg font-semibold mb-1">
                              {order.orderNumber}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {order.items.length} items •{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                          <p className="font-bold text-xl">
                            R {order.totalAmount.toFixed(2)}
                          </p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                          <Button variant="outline" size="sm">
                            <EyeIcon size={16} className="mr-2" />
                            View Details
                          </Button>
                          {order.status === "Delivered" && (
                            <Button size="sm">
                              <PackageIcon size={16} className="mr-2" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      case "favorites":
        return (
          <motion.div
            variants={accountTabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Favorite Items</h2>
              <p className="text-muted-foreground">{favorites.length} items</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <HeartIcon
                    size={80}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-lg">No favorite items found!</p>
                </div>
              ) : (
                favorites.map((fav, index) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="rounded-2xl shadow-sm border-none h-full flex flex-col">
                      <CardContent className="p-4 flex-grow">
                        <div className="relative mb-4">
                          <img
                            src={
                              fav.product.images[0] ||
                              "/placeholder-product.jpg"
                            }
                            alt={fav.product.name}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-product.jpg";
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background rounded-full shadow-md"
                          >
                            <HeartIcon
                              size={16}
                              className="text-destructive fill-destructive"
                            />
                          </Button>
                          {fav.product.stock === 0 && (
                            <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                              <span className="font-medium">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold mb-2">
                          {fav.product.name}
                        </CardTitle>
                        <CardDescription className="text-2xl font-bold text-primary mb-4">
                          ${fav.product.price.toFixed(2)}
                        </CardDescription>
                        {fav.product.stock > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            Out of Stock
                          </Badge>
                        )}
                      </CardContent>
                      <div className="flex gap-2 p-4 pt-0">
                        <Button
                          disabled={fav.product.stock === 0}
                          className="flex-1"
                        >
                          Add to Cart
                        </Button>
                        <Button variant="destructive" size="icon">
                          <Trash2Icon size={16} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      case "reviews":
        return (
          <motion.div
            variants={accountTabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">My Reviews</h2>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <MessageSquareTextIcon
                    size={80}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <p className="text-lg">No reviews found!</p>
                </div>
              ) : (
                reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="rounded-2xl shadow-sm border-none">
                      <CardContent className="p-6 flex items-start gap-4">
                        <Avatar className="w-16 h-16 rounded-lg overflow-hidden">
                          <AvatarImage
                            src={
                              review.product.images[0] ||
                              "/placeholder-product.jpg"
                            }
                            alt={review.product.name}
                          />
                          <AvatarFallback>
                            <StarIcon size={24} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-lg font-semibold">
                              {review.product.name}
                            </CardTitle>
                            <div className="flex items-center gap-1 text-yellow-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating ? "fill-current" : ""
                                  }
                                />
                              ))}
                              <span className="text-sm">
                                ({review.rating}.0)
                              </span>
                            </div>
                          </div>
                          <CardDescription className="mb-3">
                            {review.comment}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground">
                            Reviewed on{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={accountContainerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* sidebar */}
        <motion.div
          variants={accountItemVariants}
          className="lg:w-64 flex-shrink-0 hidden lg:block"
        >
          <Card className="shadow-sm border sticky top-8 p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    user.profileImage || "/svg/vercel-placeholder-avatar.svg"
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full justify-start h-auto ${
                      activeTab === tab.id ? "shadow-lg shadow-primary/20" : ""
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start ">
                <LogOutIcon />
                Sign out
              </Button>
            </div>
          </Card>
        </motion.div>
        {/* Mobile Sidebar Trigger */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
            <Button variant="outline" size="icon">
              <UserIcon size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 pt-10">
            <SheetHeader className="px-6 pb-6 border-b border-border">
              <SheetTitle className="sr-only">Account Navigation</SheetTitle>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={user.profileImage || "/placeholder-avatar.jpg"}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
            </SheetHeader>
            <nav className="p-6 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsSheetOpen(false);
                    }}
                    className={`w-full justify-start py-3 h-auto ${
                      activeTab === tab.id ? "shadow-lg shadow-primary/20" : ""
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    <span className="font-medium">{tab.label}</span>
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive py-3 h-auto mt-6"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">Sign Out</span>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        {/* Main Content Area */}
        <motion.div variants={accountItemVariants} className="flex-1">
          <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AccountClient;
