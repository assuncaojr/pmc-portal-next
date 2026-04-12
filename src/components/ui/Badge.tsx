import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "warning" | "success" | "outline";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-pmc-primary/10 text-pmc-primary",
      secondary: "bg-pmc-dark/10 text-pmc-dark",
      warning: "bg-pmc-warning/10 text-orange-600",
      success: "bg-green-100 text-green-700",
      outline: "border border-gray-200 text-gray-500",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
