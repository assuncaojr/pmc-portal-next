import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: "bg-pmc-primary text-white hover:bg-pmc-primary/90 shadow-pmc hover:shadow-pmc-xl",
      secondary: "bg-pmc-secondary text-white hover:bg-pmc-secondary/90 shadow-pmc",
      warning: "bg-pmc-warning text-pmc-dark hover:bg-pmc-warning/90",
      outline: "border-2 border-pmc-primary text-pmc-primary hover:bg-pmc-primary hover:text-white",
      ghost: "text-pmc-primary hover:bg-pmc-primary/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl font-bold",
      lg: "px-8 py-4 text-lg rounded-2xl font-black uppercase tracking-tight",
      icon: "p-2.5 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
