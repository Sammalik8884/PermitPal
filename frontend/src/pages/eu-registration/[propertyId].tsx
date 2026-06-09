import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RegistrationStepper } from "./components/registration-stepper";
import { StepContent } from "./components/step-content";
import {
  useEuRegistrationProgress,
  useUpdateEuStep,
  useGenerateRegistrationNumber,
} from "@/hooks/use-eu-registration";

function EuRegistrationPropertyPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: registration, isLoading } = useEuRegistrationProgress(propertyId);
  const updateStep = useUpdateEuStep();
  const generateRegNumber = useGenerateRegistrationNumber();

  // Determine current step index (first incomplete step)
  const currentStepIndex = registration
    ? registration.steps.findIndex((s) => !s.isCompleted)
    : 0;

  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Use active step if set, otherwise use current step
  const displayStepIndex = activeStepIndex ?? (currentStepIndex === -1 ? registration?.steps.length ? registration.steps.length - 1 : 0 : currentStepIndex);

  const handleMarkComplete = (stepId: string) => {
    if (!propertyId) return;
    updateStep.mutate({
      propertyId,
      stepId,
      isCompleted: true,
    });
  };

  const handleSubmitRegistrationNumber = (number: string) => {
    if (!propertyId) return;
    generateRegNumber.mutate({
      propertyId,
      registrationNumber: number,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!registration) {
    return (
      <>
        <PageHeader
          title="Registration Not Found"
          description="The requested property registration could not be found."
          breadcrumbs={[
            { label: "EU Registration", href: "/eu-registration" },
            { label: "Not Found" },
          ]}
        />
        <Button variant="outline" onClick={() => navigate("/eu-registration")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to EU Registration
        </Button>
      </>
    );
  }

  const allStepsCompleted = registration.steps.every((s) => s.isCompleted);

  return (
    <>
      <PageHeader
        title={`${registration.countryFlag} ${registration.propertyName}`}
        description={`Registration wizard for ${registration.countryName}`}
        breadcrumbs={[
          { label: "EU Registration", href: "/eu-registration" },
          { label: registration.propertyName },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/eu-registration")}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
        }
      />

      <div className={isDesktop ? "flex gap-8" : "space-y-6"}>
        {/* Stepper */}
        <div className={isDesktop ? "w-64 shrink-0" : ""}>
          <RegistrationStepper
            steps={registration.steps}
            currentStepIndex={displayStepIndex}
            onStepClick={(index) => setActiveStepIndex(index)}
            orientation={isDesktop ? "vertical" : "horizontal"}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 min-w-0">
          {registration.steps.map((step, index) => (
            <div key={step.id} className={index === displayStepIndex ? "block" : "hidden"}>
              <StepContent
                step={step}
                isActive={index === displayStepIndex}
                onMarkComplete={handleMarkComplete}
                onSubmitRegistrationNumber={handleSubmitRegistrationNumber}
                isUpdating={updateStep.isPending || generateRegNumber.isPending}
                registrationNumber={registration.registrationNumber}
                allStepsCompleted={allStepsCompleted}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default EuRegistrationPropertyPage;
