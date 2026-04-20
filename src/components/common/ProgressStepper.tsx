"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  completedSteps?: number[];
}

export default function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  completedSteps = [],
}: ProgressStepperProps) {
  const progressPercentage = ((currentStep - 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#0A0E1A]">الخطوة {currentStep} من {steps.length}</h3>
          <span className="text-xs font-bold text-[#00C2A8]">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="relative h-2 bg-[#E8ECF4] rounded-full overflow-hidden">
          <div
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#1A4FD6] to-[#00C2A8] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex gap-4 rtl">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = step.id < currentStep;

          return (
            <div key={step.id} className="flex-1 text-center">
              <button
                onClick={() => onStepClick?.(step.id)}
                className="flex flex-col items-center gap-2 w-full transition-all duration-300"
                disabled={!onStepClick}
              >
                <div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${isCurrent ? "bg-[#1A4FD6] scale-110 shadow-lg shadow-[#1A4FD6]/50" : ""}
                    ${isCompleted || isPast ? "bg-[#00C2A8]" : ""}
                    ${!isCurrent && !isCompleted && !isPast ? "bg-[#E8ECF4]" : ""}
                    ${onStepClick && !isCurrent ? "hover:scale-105 cursor-pointer" : ""}
                  `}
                >
                  {isCompleted || isPast ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    <Circle className={`w-5 h-5 ${!isCompleted && !isPast ? "text-[#8892A4]" : ""}`} />
                  )}
                </div>

                <div className="text-right">
                  <p
                    className={`
                      text-xs font-bold transition-colors duration-300
                      ${isCurrent ? "text-[#1A4FD6]" : "text-[#0A0E1A]"}
                      ${isCompleted || isPast ? "text-[#00C2A8]" : ""}
                      ${!isCurrent && !isCompleted && !isPast ? "text-[#8892A4]" : ""}
                    `}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[10px] text-[#8892A4] mt-0.5">{step.description}</p>
                  )}
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute top-5 right-[-50%] w-[calc(100%-1rem)] h-0.5
                    transition-colors duration-300
                    ${isPast ? "bg-[#00C2A8]" : "bg-[#E8ECF4]"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
