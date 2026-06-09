import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAllEuRequirements } from "@/hooks/use-eu-registration";
import type { EuCountryRequirements } from "@/lib/mock-data";

interface RequirementsPanelProps {
  selectedCountryCode?: string;
}

export function RequirementsPanel({ selectedCountryCode }: RequirementsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: allRequirements } = useAllEuRequirements();

  const selectedRequirements = allRequirements?.find(
    (r) => r.countryCode === selectedCountryCode
  );

  const displayRequirements = selectedRequirements
    ? [selectedRequirements]
    : allRequirements ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            EU STR Regulation Summary
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!isExpanded && (
          <p className="text-xs text-muted-foreground">
            Click to expand country-specific requirements and official portal links.
          </p>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {displayRequirements.map((req) => (
            <CountryRequirementCard key={req.countryCode} requirement={req} />
          ))}

          {displayRequirements.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No requirements data available. Select a country to view specific regulations.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function CountryRequirementCard({ requirement }: { requirement: EuCountryRequirements }) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{requirement.countryFlag}</span>
          <h4 className="font-medium">{requirement.countryName}</h4>
        </div>
        <div className="flex items-center gap-2">
          {requirement.nightCapDays && (
            <Badge variant="secondary" className="text-xs">
              {requirement.nightCapDays}-night cap
            </Badge>
          )}
          {requirement.registrationMandatory && (
            <Badge variant="destructive" className="text-xs">
              Mandatory
            </Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{requirement.summary}</p>

      <Separator />

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Requirements
        </p>
        <ul className="space-y-1">
          {requirement.requirements.map((req, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        <p className="text-xs text-amber-600 dark:text-amber-400">
          {requirement.penaltyInfo}
        </p>
      </div>

      <a
        href={requirement.officialPortalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Official registration portal
      </a>
    </div>
  );
}
