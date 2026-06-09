import { useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

// ─── Requirements ────────────────────────────────────────────────────────────

const requirements: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

// ─── Strength Calculation ────────────────────────────────────────────────────

function getStrength(password: string): number {
  if (!password) return 0;
  return requirements.filter((req) => req.test(password)).length;
}

function getStrengthLabel(strength: number): string {
  switch (strength) {
    case 0:
      return "";
    case 1:
      return "Weak";
    case 2:
      return "Weak";
    case 3:
      return "Fair";
    case 4:
      return "Good";
    case 5:
      return "Strong";
    default:
      return "";
  }
}

function getStrengthColor(strength: number): string {
  switch (strength) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-lime-500";
    case 5:
      return "bg-green-500";
    default:
      return "bg-muted";
  }
}

function getStrengthTextColor(strength: number): string {
  switch (strength) {
    case 1:
      return "text-red-600";
    case 2:
      return "text-orange-600";
    case 3:
      return "text-yellow-600";
    case 4:
      return "text-lime-600";
    case 5:
      return "text-green-600";
    default:
      return "text-muted-foreground";
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => getStrength(password), [password]);
  const label = getStrengthLabel(strength);
  const metRequirements = useMemo(
    () => requirements.map((req) => ({ ...req, met: req.test(password) })),
    [password]
  );

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Password strength
          </span>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("text-xs font-medium", getStrengthTextColor(strength))}
            >
              {label}
            </motion.span>
          )}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
            >
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  i < strength ? getStrengthColor(strength) : "bg-transparent"
                )}
                initial={{ width: 0 }}
                animate={{ width: i < strength ? "100%" : "0%" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Checklist */}
      <ul className="space-y-1.5">
        {metRequirements.map((req, index) => (
          <motion.li
            key={req.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            {req.met ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="h-3.5 w-3.5 text-green-600" />
              </motion.div>
            ) : (
              <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            <span
              className={cn(
                "text-xs transition-colors duration-200",
                req.met ? "text-green-700" : "text-muted-foreground"
              )}
            >
              {req.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
