"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
              index < currentStep
                ? "bg-primary border-primary text-primary-foreground"
                : index === currentStep
                ? "border-primary text-primary"
                : "border-muted-foreground/30 text-muted-foreground"
            )}
            onClick={() => onStepClick && onStepClick(index)}
            role={onStepClick ? "button" : undefined}
            tabIndex={onStepClick ? 0 : undefined}
          >
            {index < currentStep ? (
              <Check className="h-5 w-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-20 h-[2px] mx-1",
                index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          )}
          <div
            className={cn(
              "absolute mt-16 text-sm font-medium transition-colors hidden md:block",
              index === currentStep ? "text-primary" : "text-muted-foreground"
            )}
            style={{
              transform: `translateX(${index * 120 - steps.length * 30}px)`,
            }}
          >
            {step.title}
          </div>
        </div>
      ))}
    </div>
  );
}
