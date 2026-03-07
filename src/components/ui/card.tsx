import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article";
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, as: Tag = "div", hoverable = true, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "bg-white",
          hoverable && "hover:shadow-lg transition-shadow duration-500",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
export type { CardProps };
