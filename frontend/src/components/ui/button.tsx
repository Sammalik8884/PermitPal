import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: Airbnb button-md typography, transition, no hard corners
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-[500] text-[16px] leading-[1.25] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222222] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        // button-primary: Rausch fill, white text, 8px radius, 48px height
        default:
          "bg-[#ff385c] text-white rounded-[8px] px-6 h-12 hover:bg-[#e00b41]",
        // button-secondary: white fill, ink text, 1px ink outline
        secondary:
          "bg-white text-[#222222] rounded-[8px] px-6 h-12 border border-[#222222] hover:bg-[#f7f7f7]",
        // button-tertiary-text: no surface, underlined on hover
        ghost:
          "bg-transparent text-[#222222] hover:underline h-auto px-0",
        // button-pill-rausch: pill shape
        pill:
          "bg-[#ff385c] text-white rounded-full px-5 py-2.5 text-[14px] hover:bg-[#e00b41]",
        // outline: border style for outlines
        outline:
          "bg-white text-[#222222] rounded-[8px] px-6 h-12 border border-[#dddddd] hover:border-[#222222] hover:bg-[#f7f7f7]",
        destructive:
          "bg-[#c13515] text-white rounded-[8px] px-6 h-12 hover:bg-[#b32505]",
        link:
          "text-[#222222] underline-offset-4 hover:underline h-auto px-0 text-[14px]",
      },
      size: {
        default: "",
        sm: "h-10 px-4 text-[14px]",
        lg: "h-14 px-8 text-[16px]",
        icon: "h-10 w-10 rounded-full p-0 flex-shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
