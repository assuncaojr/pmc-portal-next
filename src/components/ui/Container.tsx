import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizes = {
      default: "max-w-container",
      narrow: "max-w-4xl",
      wide: "max-w-7xl",
      full: "max-w-full",
    };

    // <div className="container mx-auto px-4 max-w-5xl"></div>

    return (
      <div
        ref={ref}
        className={cn("container mx-auto px-4 w-full", sizes[size], className)}
        {...props}
      />
    );
  },
);

Container.displayName = "Container";

export { Container };
