import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Checkbox ────────────────────────────────────────────────────────────────

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, id, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "transition-colors duration-150",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          "flex items-center justify-center text-current",
          "data-[state=checked]:animate-scale-in data-[state=indeterminate]:animate-scale-in"
        )}
      >
        {props.checked === "indeterminate" ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (!label) return checkbox;

  return (
    <div className="flex items-start space-x-2">
      {checkbox}
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
export type { CheckboxProps };
