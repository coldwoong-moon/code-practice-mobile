import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  animated?: boolean;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      color = "blue",
      animated = true,
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colorClasses = {
      blue: "bg-blue-600",
      green: "bg-green-600",
      yellow: "bg-yellow-600",
      red: "bg-red-600",
      purple: "bg-purple-600",
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              colorClasses[color],
              animated && "animate-pulse"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 text-right text-xs text-gray-600">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
