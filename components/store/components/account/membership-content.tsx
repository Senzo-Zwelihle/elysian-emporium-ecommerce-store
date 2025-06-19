"use client";

import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { membershipfadeInUp } from "@/utils/animation/motion";
import { membershipTiers } from "@/constants/store/membership";

const MembershipPlansContent = () => {
  const searchParams = useSearchParams();
  const selectedPlanSlug = searchParams.get("plan");
  const selectedPlan = membershipTiers.find(
    (tier) => tier.tier.toLowerCase().replace(/\s/g, "-") === selectedPlanSlug
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {selectedPlan ? (
          <motion.div
            key={selectedPlan.tier}
            variants={membershipfadeInUp}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <Card className="max-w-2xl mx-auto border shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">
                  {selectedPlan.tier} Plan
                </CardTitle>
                <p className="text-xl text-muted-foreground mt-2">
                  {selectedPlan.price === 0
                    ? "Free"
                    : `R${selectedPlan.price} / mo`}
                </p>
              </CardHeader>

              <CardContent>
                <h3 className="text-xl font-semibold mb-4">What you get:</h3>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex justify-center">
                <Button size="lg" asChild>
                  <Link href="/products">
                    {selectedPlan.price === 0 ? "Start Free Trial" : "Join Now"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.p
            key="no-plan"
            className="text-center text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No plan selected or plan not found. Please choose a valid membership
            tier.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-12 text-center"
        variants={membershipfadeInUp}
        initial="hidden"
        animate="show"
      >
        <h3 className="text-2xl font-semibold mb-6">
          Explore all Membership Tiers:
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {membershipTiers.map((tier) => (
            <motion.div
              key={tier.tier}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button variant="outline" size="lg" asChild>
                <Link
                  href={`/plans?plan=${tier.tier
                    .toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  {tier.tier} Plan
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default MembershipPlansContent;
