import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  // Airbnb text-input: white surface, 1px hairline, 8px radius, 56px height
  // On focus: border becomes 2px ink (#222222), no glow/ring
  "flex w-full rounded-[8px] border border-[#dddddd] bg-white px-3 text-[16px] font-[400] text-[#222222] placeholder:text-[#929292] transition-colors duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-[2px] focus-visible:border-[#222222] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#222222]",
  {
    variants: {
      inputSize: {
        default: "h-[56px] py-[14px] px-[12px]",
        sm: "h-[48px] py-3 px-3 text-[14px]",
        lg: "h-[64px] py-5 px-4 text-[18px]",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, prefix, suffix, inputSize, label, ...props }, ref) => {
    if (prefix || suffix) {
      return (
        <div className="relative">
          {label && (
            <label className="block text-[14px] font-[500] text-[#6a6a6a] mb-1 leading-[1.29]">
              {label}
            </label>
          )}
          <div
            className={cn(
              "flex items-center rounded-[8px] border border-[#dddddd] bg-white transition-colors duration-150 focus-within:border-[2px] focus-within:border-[#222222] hover:border-[#222222] overflow-hidden",
              error && "border-[#c13515] focus-within:border-[#c13515]",
              props.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {prefix && <span className="flex items-center pl-3 text-[#929292]">{prefix}</span>}
            <input
              type={type}
              className={cn(
                "flex w-full bg-transparent text-[16px] text-[#222222] placeholder:text-[#929292] focus-visible:outline-none outline-none border-none ring-0 focus:ring-0 disabled:cursor-not-allowed",
                inputSize === "sm" && "h-[48px] py-3 px-3 text-[14px]",
                inputSize === "lg" && "h-[64px] py-5 px-4 text-[18px]",
                (!inputSize || inputSize === "default") && "h-[56px] py-[14px] px-[12px]",
                prefix && "pl-2",
                suffix && "pr-2",
                className
              )}
              ref={ref}
              aria-invalid={!!error}
              aria-describedby={error ? `${props.id}-error` : undefined}
              {...props}
            />
            {suffix && <span className="flex items-center pr-3 text-[#929292]">{suffix}</span>}
          </div>
          {error && <p id={`${props.id}-error`} className="mt-1.5 text-[12px] text-[#c13515]" role="alert">{error}</p>}
        </div>
      );
    }

    return (
      <div>
        {label && (
          <label className="block text-[14px] font-[500] text-[#6a6a6a] mb-1 leading-[1.29]">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ inputSize }),
            error && "border-[#c13515] focus-visible:border-[#c13515]",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && <p id={`${props.id}-error`} className="mt-1.5 text-[12px] text-[#c13515]" role="alert">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
