import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border border-gray-100 rounded-pmc p-6 transition-all duration-300",
          hover && "hover:shadow-pmc-xl hover:-translate-y-1 group",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };
