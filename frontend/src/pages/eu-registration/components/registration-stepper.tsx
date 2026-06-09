import { motion } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EuRegistrationStepData } from "@/lib/mock-data";

interface RegistrationStepperProps {
  steps: EuRegistrationStepData[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  orientation?: "vertical" | "horizontal";
}

export function RegistrationStepper({
  steps,
  currentStepIndex,
  onStepClick,
  orientation = "vertical",
}: RegistrationStepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <nav
      aria-label="Registration progress"
      className={cn(
        isVertical ? "flex flex-col gap-0" : "flex items-center gap-0 overflow-x-auto pb-2"
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = step.isCompleted;
        const isCurrent = index === currentStepIndex;
        const isPending = !isCompleted && !isCurrent;

        return (
          <div
            key={step.id}
            className={cn(
              isVertical
                ? "flex items-start gap-3"
                : "flex flex-col items-center gap-1 min-w-[100px]"
            )}
          >
            {/* Step indicator + connector */}
            <div
              className={cn(
                isVertical
                  ? "flex flex-col items-center"
                  : "flex items-center"
              )}
            >
              {/* Step circle */}
              <motion.button
                type="button"
                onClick={() => onStepClick(index)}
                className={cn(
                  "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isCurrent && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  isPending && "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </motion.button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    isVertical
                      ? "w-0.5 h-8 my-1"
                      : "h-0.5 w-8 mx-1",
                    isCompleted
                      ? "bg-green-500"
                      : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>

            {/* Step label */}
            <div
              className={cn(
                isVertical ? "pt-1.5 pb-6" : "text-center mt-1",
                "min-w-0"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium leading-tight",
                  isCompleted && "text-green-600 dark:text-green-400",
                  isCurrent && "text-foreground",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.displayName}
              </p>
              {isVertical && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
