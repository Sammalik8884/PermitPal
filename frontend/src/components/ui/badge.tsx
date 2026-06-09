import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-[600] text-[11px] leading-[1.18] transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#ff385c] text-white px-[10px] py-1",
        secondary:
          "bg-[#f7f7f7] text-[#222222] px-[10px] py-1 border border-[#dddddd]",
        destructive:
          "bg-[#c13515] text-white px-[10px] py-1",
        outline:
          "text-[#222222] border border-[#dddddd] px-[10px] py-1 bg-white",
        success:
          "bg-[#f0faf4] text-[#1a7a40] border border-[#a8d5b5] px-[10px] py-1",
        warning:
          "bg-[#fff8e6] text-[#8a5c00] border border-[#f5d87a] px-[10px] py-1",
        info:
          "bg-[#f0f4ff] text-[#2a4db3] border border-[#a8b8f0] px-[10px] py-1",
        // guest-favorite-badge style
        guest:
          "bg-white text-[#222222] border border-[#dddddd] shadow-sm px-[10px] py-1",
      },
      size: {
        default: "",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-[13px] px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </div>
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
