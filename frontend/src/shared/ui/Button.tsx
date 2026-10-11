import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary-hover",
  secondary: "border border-border bg-surface hover:bg-surface-muted",
  ghost: "text-text-muted hover:bg-surface-muted hover:text-text",
  danger: "bg-danger text-white hover:bg-danger/90",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
