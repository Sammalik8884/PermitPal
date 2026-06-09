import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      error: {
        true: "text-destructive",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, error, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ error }), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-0.5 text-destructive" aria-hidden="true">
        *
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = "Label";

export { Label };
