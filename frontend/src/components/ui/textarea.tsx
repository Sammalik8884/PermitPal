import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  autoResize?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, autoResize, showCount, maxLength, onChange, value, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = React.useState(0);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleResize = React.useCallback(() => {
      if (autoResize && internalRef.current) {
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
    }, [autoResize]);

    React.useEffect(() => {
      handleResize();
    }, [handleResize, value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      handleResize();
      onChange?.(e);
    };

    React.useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      }
    }, [value]);

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            autoResize && "resize-none overflow-hidden",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={setRefs}
          onChange={handleChange}
          value={value}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {(showCount || error) && (
          <div className="mt-1.5 flex items-center justify-between">
            {error ? (
              <p
                id={`${props.id}-error`}
                className="text-xs text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : (
              <span />
            )}
            {showCount && (
              <span className="text-xs text-muted-foreground">
                {charCount}
                {maxLength ? `/${maxLength}` : ""}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
