import { InView } from "@/components/core/in-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { membershipTiers } from "@/constants/store/membership";

import { CheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Memberships = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} id="memberships">
      <InView
        variants={{
          hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        viewOptions={{ margin: "0px 0px -200px 0px" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heading
          size={"md"}
          font={"PolySansMedian"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"sm"}
        >
          Pricing
        </Heading>
        <div className=" grid gap-6  md:grid-cols-3">
          {membershipTiers.map((plan) => (
            <Card
              key={plan.tier}
              className="flex flex-col relative dark:bg-background border-2"
            >
              <CardHeader>
                <CardTitle className="font-medium">
                  <Heading
                    size={"sm"}
                    font={"PolySansMedian"}
                    spacing={"normal"}
                    lineHeight={"none"}
                    margin={"none"}
                  >
                    {plan.tier}
                  </Heading>

                  {plan.popular && (
                    <Badge className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center ">
                      <SparklesIcon />
                      Popular
                    </Badge>
                  )}
                </CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  {plan.price === 0
                    ? "Free"
                    : `R${plan.price} / ${
                        plan.tier === "Elysian Enthusiast" ? "mo" : "mo"
                      }`}
                </span>
                <CardDescription className="text-sm">
                  {plan.tier === "Elysian Enthusiast"
                    ? "Start your journey"
                    : "Unlock exclusive benefits"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  asChild
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  size={"lg"}
                  disabled={true}
                >
                  <Link
                    href={`/memberships?plan=${plan.tier
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    <span>
                      {plan.price === 0 ? "Get Started" : "Choose Plan"}
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </InView>
    </Container>
  );
};

export default Memberships;
