import { useId, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface SelectProps extends ComponentProps<"select"> {
  label: string;
  error?: string;
  options: readonly { value: string; label: string }[];
}

export function Select({
  label,
  error,
  options,
  id,
  className,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full appearance-none rounded-lg border bg-surface px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2",
            error
              ? "border-danger focus:ring-danger/30"
              : "border-border focus:border-primary focus:ring-primary/30",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-muted" />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
