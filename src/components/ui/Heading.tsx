import { cn } from "@/lib/utils";
import { HTMLAttributes, JSX, forwardRef } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  variant?: "page" | "section" | "card" | "title";
  underline?: boolean;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      level = 1,
      variant = "page",
      underline = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    const variants = {
      page: "text-4xl md:text-5xl font-black text-pmc-primary uppercase tracking-tight",
      section:
        "text-2xl md:text-3xl font-bold text-pmc-primary flex items-center gap-3",
      title: "text-3xl md:text-4xl font-black text-pmc-primary leading-tight",
      card: "text-lg md:text-xl font-bold text-pmc-primary group-hover:text-pmc-warning transition-colors",
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          variants[variant],
          underline &&
            "border-b-4 border-pmc-warning pb-2 inline-block rounded-full",
          className,
        )}
        {...props}
      >
        {children}
        {variant === "section" && underline && (
          <div className="h-1 w-12 bg-pmc-warning mt-2 rounded-full hidden" />
        )}
      </Tag>
    );
  },
);

Heading.displayName = "Heading";

export { Heading };
