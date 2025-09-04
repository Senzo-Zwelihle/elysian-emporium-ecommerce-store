import React from "react";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Step = {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface ModernProgressIndicatorProps {
  currentStep: number;
  steps: Step[];
}

const ModernProgressIndicator: React.FC<ModernProgressIndicatorProps> = ({ currentStep, steps }) => {
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile Progress Bar */}
      <div className="block lg:hidden mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">
            Step {currentStep} of {totalSteps}
          </h3>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        {/* Mobile progress bar */}
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-ultramarine-500 to-ultramarine-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Current step info */}
        <div className="mt-3 p-3 bg-card border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {(() => {
                const currentStepData = steps.find(step => step.id === currentStep);
                const StepIcon = currentStepData?.icon;
                return currentStep > totalSteps ? (
                  <div className="w-6 h-6 bg-ultramarine-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : StepIcon ? (
                  <div className="w-6 h-6 bg-ultramarine-600 rounded-full flex items-center justify-center">
                    <StepIcon className="w-4 h-4 text-white" />
                  </div>
                ) : null;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">
                {steps.find(step => step.id === currentStep)?.name || 'Complete'}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentStep > totalSteps ? 'Order completed successfully' : 'Currently processing...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Progress Indicator */}
      <div className="hidden lg:block">
        <div className="relative px-4">
          {/* Background line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-border rounded-full mx-8"></div>
          
          {/* Progress line */}
          <div 
            className="absolute top-8 left-8 h-0.5 bg-gradient-to-r from-ultramarine-500 to-ultramarine-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `calc(${progressPercentage}% - 2rem)` }}
          ></div>

          {/* Steps container */}
          <div className="relative flex justify-between items-start">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center group">
                  {/* Step circle */}
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-500 transform ${
                      isCompleted
                        ? "border-ultramarine-600 bg-ultramarine-600 text-white shadow-lg shadow-ultramarine-600/20"
                        : isActive
                        ? "border-ultramarine-500 bg-ultramarine-500 text-white shadow-lg shadow-ultramarine-500/20 scale-105"
                        : "border-border bg-card text-muted-foreground hover:border-ultramarine-300 hover:shadow-md"
                    }`}
                  >
                    {/* Pulse animation for active step */}
                    {isActive && (
                      <div className="absolute -inset-1 rounded-full border-2 border-ultramarine-300 animate-ping opacity-75"></div>
                    )}
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  {/* Step label */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <p
                      className={`text-sm font-medium transition-all duration-300 mb-1 ${
                        isActive
                          ? "text-ultramarine-600"
                          : isCompleted
                          ? "text-ultramarine-700"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </p>
                    
                    {/* Status indicator */}
                    <Badge 
                      variant={isCompleted ? "default" : isActive ? "secondary" : "outline"}
                      className={`text-xs ${
                        isCompleted 
                          ? "bg-ultramarine-600 hover:bg-ultramarine-700" 
                          : isActive 
                          ? "bg-ultramarine-100 text-ultramarine-700 border-ultramarine-200" 
                          : ""
                      }`}
                    >
                      {isCompleted ? "Complete" : isActive ? "In Progress" : "Pending"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProgressIndicator;