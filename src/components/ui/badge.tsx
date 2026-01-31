import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "beginner" | "easy" | "medium" | "hard" | "expert" | "default";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center rounded-full px-2.5 py-0.5",
          "text-xs font-semibold transition-colors",
          "border",
          // Variant styles
          {
            // Beginner - Light green
            "bg-emerald-100 text-emerald-800 border-emerald-200":
              variant === "beginner",
            // Easy - Green
            "bg-green-100 text-green-800 border-green-200":
              variant === "easy",
            // Medium - Yellow/Orange
            "bg-yellow-100 text-yellow-800 border-yellow-200":
              variant === "medium",
            // Hard - Orange/Red
            "bg-orange-100 text-orange-800 border-orange-200":
              variant === "hard",
            // Expert - Red
            "bg-red-100 text-red-800 border-red-200":
              variant === "expert",
            // Default - Gray
            "bg-gray-100 text-gray-800 border-gray-200":
              variant === "default",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
