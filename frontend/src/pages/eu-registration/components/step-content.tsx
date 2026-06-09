import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ExternalLink,
  CheckCircle2,
  Copy,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EuRegistrationStepData } from "@/lib/mock-data";
import toast from "react-hot-toast";

interface StepContentProps {
  step: EuRegistrationStepData;
  isActive: boolean;
  onMarkComplete: (stepId: string) => void;
  onSubmitRegistrationNumber?: (number: string) => void;
  isUpdating: boolean;
  registrationNumber?: string | null;
  allStepsCompleted?: boolean;
}

export function StepContent({
  step,
  isActive,
  onMarkComplete,
  onSubmitRegistrationNumber,
  isUpdating,
  registrationNumber,
  allStepsCompleted,
}: StepContentProps) {
  const [regNumber, setRegNumber] = useState("");

  const handleCopyRegistration = () => {
    if (registrationNumber) {
      navigator.clipboard.writeText(registrationNumber);
      toast.success("Registration number copied to clipboard");
    }
  };

  const handleAutoApply = () => {
    if (!registrationNumber) {
      toast.error("Generate a registration number first!");
      return;
    }
    
    const applyPromise = new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.promise(applyPromise, {
      loading: 'Syncing to Airbnb, Vrbo, and Booking.com...',
      success: 'Successfully applied to all platforms!',
      error: 'Failed to sync to platforms.',
    });
  };

  // Completion celebration state
  if (allStepsCompleted && step.order === 5) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center text-center py-6 space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
          >
            <PartyPopper className="h-16 w-16 text-green-500" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
              Registration Complete! 🎉
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              All steps have been completed successfully.
            </p>
          </div>

          {registrationNumber ? (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 w-full max-w-sm">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                Registration Number
              </p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-bold text-green-700 dark:text-green-300">
                  {registrationNumber}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyRegistration}
                  className="h-7 w-7 p-0"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => onSubmitRegistrationNumber?.("auto-generate")}
              disabled={isUpdating}
              className="mt-4"
            >
              {isUpdating ? "Generating..." : "Generate Registration Number"}
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={handleAutoApply}
          >
            Auto-apply to all platforms
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex items-center gap-2 py-2">
        {step.isCompleted ? (
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Pending
          </Badge>
        )}
        {step.isCompleted && step.completedAt && (
          <span className="text-xs text-muted-foreground">
            {new Date(step.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {step.displayName}
              <Badge variant="secondary" className="text-xs">
                Step {step.order}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload requirement */}
            {step.requiresUpload && !step.isCompleted && (
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop files here, or click to browse
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose File
                </Button>
              </div>
            )}

            {/* External portal link */}
            {step.externalPortalUrl && (
              <a
                href={step.externalPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open official registration portal
              </a>
            )}

            {/* Registration number input for final step */}
            {step.stepName === "confirmation_received" && !step.isCompleted && (
              <div className="space-y-2">
                <Label htmlFor="reg-number">Registration Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="reg-number"
                    placeholder="Enter your registration number"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                  />
                  <Button
                    size="sm"
                    disabled={!regNumber.trim() || isUpdating}
                    onClick={() => {
                      onSubmitRegistrationNumber?.(regNumber);
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {/* Mark as complete button */}
            {!step.isCompleted && step.stepName !== "confirmation_received" && (
              <Button
                onClick={() => onMarkComplete(step.id)}
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                {isUpdating ? "Updating..." : "Mark as Complete"}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
