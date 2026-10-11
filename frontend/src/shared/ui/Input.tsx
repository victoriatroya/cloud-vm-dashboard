import { useId, type ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  hint?: string;
  suffix?: string;
}

export function Input({
  label,
  error,
  hint,
  suffix,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm outline-none transition",
            "placeholder:text-text-muted/70 focus:ring-2",
            error
              ? "border-danger focus:ring-danger/30"
              : "border-border focus:border-primary focus:ring-primary/30",
            suffix && "pr-14",
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-text-muted">
            {suffix}
          </span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={cn("text-xs", error ? "text-danger" : "text-text-muted")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
