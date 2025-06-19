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
    <div >
      {/* Mobile Progress Bar */}
      <div className="block md:hidden mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Step {currentStep} of {totalSteps}
          </h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        {/* Mobile progress bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-ultramarine-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Current step info */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {(() => {
                const currentStepData = steps.find(step => step.id === currentStep);
                const StepIcon = currentStepData?.icon;
                return currentStep > totalSteps ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className=" text-white" />
                  </div>
                ) : StepIcon ? (
                  <div className="w-8 h-8 bg-ultramarine-500 rounded-full flex items-center justify-center">
                    <StepIcon className=" text-white" />
                  </div>
                ) : null;
              })()}
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {steps.find(step => step.id === currentStep)?.name || 'Complete'}
              </p>
              <p className="text-sm text-gray-600">
                {currentStep > totalSteps ? 'Order completed successfully' : 'Currently processing...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Progress Indicator */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
          </div>
          
          {/* Progress line */}
          <div 
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-blue-500 via-ultramarine-700 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full animate-pulse"></div>
          </div>

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
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 transition-all duration-500 transform ${
                      isCompleted
                        ? "border-green-400 bg-green-500 text-white shadow-xl shadow-green-500/30 scale-110"
                        : isActive
                        ? "border-ultramarine-400 bg-ultramarine-700 text-white shadow-xl shadow-blue-500/30 scale-110"
                        : "border-gray-300 bg-white text-gray-400 shadow-md hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {/* Pulse animation for active step */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-ultramarine-300 "></div>
                    )}
                    
                    {/* Glow effect for completed steps */}
                    {isCompleted && (
                      <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-pulse"></div>
                    )}
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      {isCompleted ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <StepIcon className={`w-7 h-7 ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                    </div>
                  </div>

                  {/* Step label */}
                  <div className="mt-4 text-center min-h-[3rem] flex flex-col justify-start">
                    <p
                      className={`text-sm font-semibold transition-all duration-300 mb-1 ${
                        isActive
                          ? "text-blue-600 scale-105"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </p>
                    
                    {/* Status indicator */}
                    <div className="flex items-center justify-center">

                      <Badge className="mt-2">

                        {isCompleted ? "Complete" : isActive ? "In Progress" : "Pending"}
                      </Badge>
                      {/* <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                          isCompleted
                            ? "bg-green-100 text-green-800"
                            : isActive
                            ? "bg-blue-100 text-blue-800 "
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isCompleted ? "✓ Done" : isActive ? "In Progress" : "Pending"}
                      </span> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress summary */}
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-2xl px-4 py-2 border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full "></div>
                  <span className="text-sm font-medium text-gray-700">
                    Progress: {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  {currentStep > totalSteps ? 'Completed' : `Step ${currentStep} of ${totalSteps}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ModernProgressIndicator;