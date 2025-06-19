"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LoaderIcon,
} from "lucide-react";

interface OrderNavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlaceOrder: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}
const OrderNavigationControls = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPlaceOrder,
  isNextDisabled = false,
  isLoading = false,
}: OrderNavigationControlsProps) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  return (
    <div className="flex justify-between items-center space-x-4 mt-8">
      <Button
        variant="outline"
        size={"lg"}
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
      >
        <ArrowLeftIcon /> Back
      </Button>

      {isLastStep ? (
        <Button onClick={onPlaceOrder} disabled={isNextDisabled || isLoading} size={"store"}>
          {isLoading ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <CheckCircleIcon />
          )}
          {isLoading ? "Placing Order..." : "Place Order"}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          size={"store"}
        >
          Next
          {isLoading ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            <ArrowRightIcon />
          )}
        </Button>
      )}
    </div>
  );
};

export default OrderNavigationControls;
